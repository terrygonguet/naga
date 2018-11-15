import { findByComponent } from "geotic"
import { make_xy2i, make_isInBounds, make_cmpPos, byPosition } from "../tools"
import _order from "./order.json"

/**
 * Adds an FoV to the entity so it can uncover hidden rooms
 * @param {Entity} e The entity to attach the component to
 */
export function fov(e) {
	return "fov"
}

/**
 * Returns the 8 adjacent coordinates
 * @param {Object} params
 * @param {Number} [params.x]
 * @param {Number} [params.y]
 */
function threeByThree({ x, y }) {
	return [
		{ x: x + 1, y },
		{ x, y: y + 1 },
		{ x: x - 1, y },
		{ x, y: y - 1 },
		{ x: x + 1, y: y + 1 },
		{ x: x + 1, y: y - 1 },
		{ x: x - 1, y: y + 1 },
		{ x: x - 1, y: y - 1 },
	]
}

export function update(game) {
	let fogOfWar = findByComponent("fogOfWar")[0]?.fogOfWar.grid
	if (!fogOfWar) return

	let xy2i = make_xy2i(game.width)
	let isInBounds = make_isInBounds(game)
	let entities = findByComponent("position")

	findByComponent("fov").forEach(ent => {
		let { x, y } = ent.position
		let queue = threeByThree({ x, y })

		while (queue.length) {
			let { x, y } = queue.shift()

			// if we already uncovered this part we don't do anymore
			if (!fogOfWar[xy2i(x, y)]) continue
			else if (isInBounds(x, y)) {
				// else we uncover it
				fogOfWar[xy2i(x, y)] = 0
				// get stopped i.e. by walls and doors
				let blocksSight = entities
					.filter(byPosition({ x, y }))
					.some(e => e?.hitbox?.blocksSight)
				if (!blocksSight) queue.push(...threeByThree({ x, y }))
			}
		}
	})
}

export { fov as component }
export const name = "fov"
export const order = _order[name]
