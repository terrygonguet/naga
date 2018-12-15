import _order from "./order.json"
import { findByCanTick, isPositionBlocked } from "../tools.js"
import { getTag, findById } from "geotic"
import { vec2 } from "gl-matrix"

/**
 * Events emitted :
 * "pickedup"
 */

/**
 * A container for template data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function item(e) {
	e.on("hit", id => {
		e.item.pickedUp = true
		e.emit("pickedup", id)
	})
	return { pickedUp: false, previousBodyPositions: [] }
}

export function update(game) {
	findByCanTick("item").forEach(e => {
		let { pickedUp, previousBodyPositions: prevs } = e.item
		if (!pickedUp) return

		let snakeEnt = findById(getTag("snake").id)
		let bodyPos = snakeEnt.snake.body.map(b => findById(b).position).reverse()
		for (const pos of prevs) {
			if (!isPositionBlocked(pos)) {
				vec2.copy(e.position, pos)
				break
			}
		}
		e.item.previousBodyPositions = bodyPos
	})
}

export { item as component }
export const name = "item"
export const order = _order[name]
