import { entity } from "geotic"
import { blocks, animations } from "../blocks"

export function make({
	position,
	isRed = true,
	flipAnim = false,
	flipV = false,
}) {
	let texture = blocks.enemy[isRed ? "red" : "green"]
	let frames = animations[isRed ? "enemyRed" : "enemyGreen"].slice() // copy
	flipAnim && frames.reverse()

	let e = entity()
		.add("position", position)
		.add("sprite", { texture })
		.add("animation", { frames, flipV })
		.add("hitbox", { canBeKilled: true, givesLength: true })
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
						},
					},
					chasing: {
						on: {
							LOSE_SIGHT: "idle",
						},
					},
				},
			},
		})
		.on("hit", () => e.destroy())
		.tag("enemy")
	return e
}
