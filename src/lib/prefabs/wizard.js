import { entity, findByComponent } from "geotic"
import { blocks, animations } from "../blocks"
import { Vector } from "sylvester-es6/target/Vector"
import { byPosition } from "../tools"

export function make({ position, flipAnim = false, flipV = false }) {
	let frames = animations.bear
	flipAnim && frames.reverse()

	let e = entity()
		.add("position", position)
		.add("sprite", { texture: blocks.enemy.bear })
		.add("animation", { frames, flipV })
		.add("hitbox", { canBeKilled: true })
		.add("speed", { speed: 2 })
		.add("ai", {
			data: {
				chanceToMove: 0.3,
				sightRange: 15,
				tooCloseRange: 5,
				fireRate: 0.3,
			},
			machine: {
				id: "ai",
				initial: "idle",
				states: {
					idle: {
						on: {
							SEE_PLAYER: "firing",
						},
					},
					firing: {
						on: {
							LOSE_SIGHT: "idle",
							PLAYER_CLOSE: "fleeing",
						},
					},
					fleeing: {
						on: {
							PLAYER_FAR: "firing",
						},
					},
				},
			},
		})
		.on("hit", function teleport() {
			let newPos
			do {
				newPos = e.position.add([
					Math.round(Math.random() * 10) - 5,
					Math.round(Math.random() * 10) - 5,
				])
			} while (
				findByComponent("position")
					.filter(byPosition(newPos))
					.some(e => e.hitbox)
			)
			e.position = newPos
			e.hitbox.givesLength = true
			e.off("hit", teleport)
			e.on("hit", () => e.destroy())
		})
		.tag("enemy")
	return e
}
