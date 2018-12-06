import { blocks, modifiers } from "../blocks"
import { findByComponent, findByTag } from "geotic"
import { make_xy2i, make_i2xy } from "../tools"
import _order from "./order.json"
import { Graphics } from "pixi.js"

/**
 * The fog of war over the map, gets revealed by an entity with an fov
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} params.width
 * @param {Number} params.heigh
 */
export function fogOfWar(e, { width, height } = {}) {
	if (findByComponent("fogOfWar").length)
		throw new Error("Only one fog of war component should exist")

	let game = findByTag("game")[0].tags.game
	let grid = Array(width * height).fill(1)
	let xy2i = make_xy2i(width)
	let i2xy = make_i2xy(width)
	// reveal the edges for A E S T H E T I C S
	for (let x = 0; x < width; x++)
		grid[xy2i(x, 0)] = grid[xy2i(x, height - 1)] = 0
	for (let y = 0; y < width; y++)
		grid[xy2i(0, y)] = grid[xy2i(width - 1, y)] = 0
	let sprites = grid.map((c, i) => {
		let s = new Graphics()
		s.drawRect(0, 0, 16.1, 16.1)
		let { x, y } = i2xy(i)
		s.position.set(x * 16, y * 16)
		s.alpha = c
		game.layers.fogOfWar.addChild(s)
		return s
	})

	return {
		grid,
		sprites,
		dirty: true,
		width,
		height,
	}
}

export function update(game) {
	let ent = findByComponent("fogOfWar")[0]
	if (!ent) return
	let i2xy = make_i2xy(game.width)

	let { grid, sprites, dirty } = ent.fogOfWar
	if (dirty) {
		grid.forEach((c, i) => {
			sprites[i].alpha = c
			// grid[i] = c ? c : 0.5
		})
		ent.fogOfWar.dirty = false
		game.layers.fogOfWar.cacheAsBitmap = false
	} else game.layers.fogOfWar.cacheAsBitmap = true
}

export { fogOfWar as component }
export const name = "fogOfWar"
export const order = _order[name]
