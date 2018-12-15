import { entity, getTag, findById } from "geotic"
import { vec2 } from "gl-matrix"
import { blocks } from "../blocks"

export function make({ position, speed = 4 }) {
	let e = entity()
		.add("position", vec2.clone(position))
		.add("hitbox", { canBeKilled: true })
		.add("sprite", { texture: blocks.key })
		.add("speed", speed)
		.add("item")
		.on("pickedup", () => {
			let portal = findById(getTag("portal").id)
			portal.add("invincible", Infinity)
		})
		.tag("item")
	e.tag("key", { id: e.id })
	return e
}
