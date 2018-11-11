import { blocks } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

/**
 * The fog of war over the map, gets revealed by an entity with an fov
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} params.width
 * @param {Number} params.heigh
 */
export function fogOfWar(e, { width, height }) {
	let grid = Array(width * height).fill(true)
	let xy2i = make_xy2i(width)
	// reveal the edges for A E S T H E T I C S
	for (let x = 0; x < width; x++)
		grid[xy2i(x, 0)] = grid[xy2i(x, height - 1)] = false
	for (let y = 0; y < width; y++)
		grid[xy2i(0, y)] = grid[xy2i(width - 1, y)] = false
	return {
		grid,
		width,
		height,
	}
}

export function update(game) {
	let fogOfWar = findByComponent("fogOfWar")[0]?.fogOfWar.grid
	if (!fogOfWar) return

	// cover anything that hasn't been revealed yet
	game.foreground = game.foreground.map((c, i) =>
		fogOfWar[i] ? blocks.hidden : c
	)
}

export { fogOfWar as component }
export const name = "fogOfWar"
export const order = _order[name]
