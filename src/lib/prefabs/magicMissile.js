import { entity } from "geotic"
import { blocks, animations } from "../blocks"

export function make({ position, direction, speed }) {
	entity()
		.add("position", position)
		.add("sprite", { type: blocks.magic.s1 })
		.add("animation", { frames: animations.magic })
		.add("hitbox")
		.add("speed", { speed })
		.add("projectile", { direction })
		.tag("projectile")
}
