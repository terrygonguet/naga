import { blocks, walls, doorAndWalls } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i, make_isInBounds, make_cmpPos } from "../tools"
import _order from "./order.json"

export function fov(e) {
	return "fov"
}

export function update(game) {
	let fogOfWar = findByComponent("fogOfWar")[0]?.fogOfWar.grid
	if (!fogOfWar) return

	let xy2i = make_xy2i(game.width)
	let isInBounds = make_isInBounds(game)
	let entities = findByComponent("position")
	findByComponent("fov").forEach(ent => {
		let { x, y } = ent.position
		let queue = [
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x - 1, y },
			{ x, y: y - 1 },
			{ x: x + 1, y: y + 1 },
			{ x: x + 1, y: y - 1 },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y - 1 },
		]
		while (queue.length) {
			let { x, y } = queue.shift()
			let cmpPos = make_cmpPos({ x, y })

			if (!fogOfWar[xy2i(x, y)]) continue
			else if (isInBounds(x, y)) {
				fogOfWar[xy2i(x, y)] = false
				let cell = entities.find(e => cmpPos(e.position))?.sprite.type
				if (!doorAndWalls.includes(cell))
					queue.push(
						{ x: x + 1, y },
						{ x, y: y + 1 },
						{ x: x - 1, y },
						{ x, y: y - 1 },
						{ x: x + 1, y: y + 1 },
						{ x: x + 1, y: y - 1 },
						{ x: x - 1, y: y + 1 },
						{ x: x - 1, y: y - 1 }
					)
			}
		}
	})
}

export { fov as component }
export const name = "fov"
export const order = _order[name]
