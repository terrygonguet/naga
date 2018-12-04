import { entity, findById, findByComponent } from "geotic"
import { blocks, animations } from "../blocks"
import { vectors, turnRight } from "../directions"
import { byPosition } from "../tools"
import { Machine } from "xstate"

export function make({ position, flipAnim = false, flipV = false }) {
	let frames = animations.knight // copy
	flipAnim && frames.reverse()

	let e = entity()
		.add("position", position)
		.add("sprite", { type: blocks.enemy.knight })
		.add("animation", { frames, flipV })
		.add("hitbox", { canBeKilled: true })
		.add("speed", { speed: 2 })
		.add("ai", {
			data: {
				chanceToMove: 0.3,
				sightRange: 15,
			},
			machine: {
				id: "ai",
				initial: "idle",
				states: {
					idle: {
						on: {
							SEE_PLAYER: "chasing",
							HIT: "stunned",
						},
					},
					chasing: {
						on: {
							LOSE_SIGHT: "idle",
							HIT: "stunned",
						},
					},
					stunned: {
						on: {
							RECOVER: "idle",
						},
					},
				},
			},
		})
		.once("hit", function(id) {
			let machine = Machine(e.ai.machine)

			e.add("invincible", 20).once("invincible-end", () => {
				e.hitbox.blocksMoving = false
				e.hitbox.givesLength = true
				e.ai.state = machine.transition(e.ai.state, "RECOVER").value
				e.on("hit", () => e.destroy())
			})
			e.sprite.type = blocks.enemy.male
			e.animation.frames = animations.male
			e.hitbox.blocksMoving = true
			e.ai.state = machine.transition(e.ai.state, "HIT").value

			let snake = findById(id).snake

			let movePos,
				canMove,
				dir,
				i = 1
			do {
				// try to move away in any direction
				dir = i == 1 ? snake.lastDirection : turnRight(dir)
				movePos = e.position.add(vectors[dir])
				canMove = !findByComponent("position")
					.filter(byPosition(movePos))
					.some(e => e.hitbox)
				i++
			} while (!canMove && i <= 4)

			if (canMove) e.position = movePos
			else {
				// if it's stuck then so be it
				e.destroy()
				snake.length++
			}
		})
		.tag("enemy")
	return e
}
