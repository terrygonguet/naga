import { entity } from "geotic"
import { vec2 } from "gl-matrix"
import { blocks } from "../blocks"

export function make({ position, speed = 4 }) {
	return entity()
		.add("position", vec2.clone(position))
		.add("hitbox", { canBeKilled: true })
		.add("sprite", { texture: blocks.key })
		.add("speed", speed)
		.add("item")
		.tag("item")
		.tag("key")
}
