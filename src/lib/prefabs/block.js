import { entity } from "geotic"
import { doorAndWalls, walls, blocks } from "../blocks"

export function make({ position, texture } = {}) {
	let e = entity()
		.add("position", position)
		.add("sprite", {
			texture,
			layer: "background",
		})
		.tag("background")
	if (texture !== blocks.ground)
		e.add("hitbox", {
			blocksSight: doorAndWalls.includes(texture),
			blocksMoving: walls.includes(texture),
		})
	return e
}
