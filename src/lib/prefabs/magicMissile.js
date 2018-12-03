import { entity } from "geotic"
import { blocks, animations } from "../blocks"

export function make({ position, direction, speed }) {
	entity()
		.add("position", position)
		.add("sprite", { type: "ground-pit" })
		.add("hitbox")
		.add("speed", { speed })
		.add("projectile", { direction })
		.tag("projectile")
}
