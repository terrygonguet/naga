import { entity } from "geotic"
import { blocks, animations } from "../blocks"

export function make({ position, flipAnim = false, flipV = false }) {
	let frames = animations.female
	flipAnim && frames.reverse()

	let e = entity()
		.add("position", position)
		.add("animation", { frames, flipV })
		.add("hitbox", { canBeKilled: true, givesLength: true })
		.add("speed", 2)
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
		.on("hit", () => setTimeout(() => e.destroy(), 0))
		.tag("enemy")
	return e
}
