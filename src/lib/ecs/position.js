import _order from "./order.json"
import { Vector } from "sylvester-es6/target/Vector"

/**
 * Keeps track of the position
 * @param {Entity} e The entity to attach the component to
 * @param {Number[]} elements The coordinates
 */
export function position(e, elements) {
	return new Vector(elements)
}

export function update(game) {}

export { position as component }
export const name = "position"
export const order = _order[name]
