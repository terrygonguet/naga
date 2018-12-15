import { entity } from "geotic"
import { vec2 } from "gl-matrix"
import { blocks } from "../blocks"

export function make({ position }) {
	let e = entity()
		.add("position", vec2.clone(position))
		.add("hitbox", { blocksMoving: true })
		.add("sprite", { texture: blocks.portal })
	e.tag("portal", { id: e.id })
	return e
}
