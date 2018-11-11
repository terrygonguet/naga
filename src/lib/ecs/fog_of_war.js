import { blocks, walls } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

export function fogOfWar(e, { width, height }) {
	let grid = Array(width * height).fill(true)
	let xy2i = make_xy2i(width)
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

	game.foreground = game.foreground.map((c, i) =>
		fogOfWar[i] ? blocks.hidden : c
	)
}

export { fogOfWar as component }
export const name = "fogOfWar"
export const order = _order[name]
