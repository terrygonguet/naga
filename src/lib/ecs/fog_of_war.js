import { blocks, modifiers } from "../blocks"
import { findByComponent } from "../geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

/**
 * The fog of war over the map, gets revealed by an entity with an fov
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} params.width
 * @param {Number} params.heigh
 */
export function fogOfWar(e, { width, height } = {}) {
	let grid = Array(width * height).fill(1)
	let xy2i = make_xy2i(width)
	// reveal the edges for A E S T H E T I C S
	for (let x = 0; x < width; x++)
		grid[xy2i(x, 0)] = grid[xy2i(x, height - 1)] = 0
	for (let y = 0; y < width; y++)
		grid[xy2i(0, y)] = grid[xy2i(width - 1, y)] = 0
	return {
		grid,
		width,
		height,
	}
}

export function update(game) {
	let ent = findByComponent("fogOfWar")[0]
	let fogOfWar = ent.fogOfWar.grid
	if (!fogOfWar) return

	// cover anything that hasn't been revealed yet and add shadow
	game.foreground = game.foreground.map((c, i) => {
		let f = fogOfWar[i]
		if (f === 1) {
			return blocks.darkness
		} else if (f === 0) {
			return c
		} else {
			return blocks.darkness + " " + modifiers.transparent // TODO : better ?
		}
	})

	// Shadow everything for next update
	ent.fogOfWar.grid = fogOfWar.map(c => (!c ? 0.5 : c))
}

export { fogOfWar as component }
export const name = "fogOfWar"
export const order = _order[name]
