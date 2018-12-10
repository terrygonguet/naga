import { entity, findByComponent } from "geotic"
import { blocks, animations } from "../blocks"
import { vec2 } from "gl-matrix"
import { isPositionBlocked } from "../tools"
import { Machine } from "xstate"
import { make as makeProjectile } from "../prefabs/projectile"

export function make({ position, flipAnim = false, flipV = false }) {
	let frames = animations.bear
	flipAnim && frames.reverse()

	let e = entity()
		.add("position", position)
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
							HIT: "stunned",
						},
					},
					firing: {
						on: {
							LOSE_SIGHT: "idle",
							PLAYER_CLOSE: "fleeing",
							HIT: "stunned",
						},
					},
					fleeing: {
						on: {
							PLAYER_FAR: "firing",
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
		.once("hit", function teleport() {
			let aimachine = Machine(e.ai.machine)
			e.ai.state = aimachine.transition(e.ai.state, "HIT").value
			let time = 5
			let projectile = makeProjectile({
				position: e.position,
				direction: vec2.random(vec2.create()),
				speed: 8,
				frames: animations.magic,
				causesDamage: false,
				pierces: true,
			})
				.on("move", () => {
					if (--time <= 0) reappear()
				})
				.on("outofbounds", () => e.destroy())

			function reappear() {
				e.ai.state = aimachine.transition(e.ai.state, "RECOVER").value
				let isFree = !isPositionBlocked(projectile.position, true)
				if (!isFree) {
					do {
						// backtrack until the space is free
						vec2.sub(
							projectile.projectile.floatPosition,
							projectile.projectile.floatPosition,
							projectile.projectile.direction
						)
						vec2.floor(projectile.position, projectile.projectile.floatPosition)
						isFree = !isPositionBlocked(projectile.position, true)
					} while (!isFree)
				}
				vec2.copy(e.position, projectile.position)
				projectile.destroy()
			}

			vec2.copy(e.position, [1000000, 1000000]) // TODO: hide better
			e.hitbox.givesLength = true
			e.on("hit", () => e.destroy())
		})
		.tag("enemy")
	return e
}
