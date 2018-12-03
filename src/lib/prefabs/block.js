import { entity } from "geotic"
import { doorAndWalls, walls } from "../blocks"

export function make({ position, type } = {}) {
	return entity()
		.add("position", position)
		.add("sprite", {
			type,
			isBackground: true,
		})
		.add("hitbox", {
			blocksSight: doorAndWalls.includes(type),
			blocksMoving: walls.includes(type),
		})
		.tag("background")
}
