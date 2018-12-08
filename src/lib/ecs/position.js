import _order from "./order.json"
import { vec2 } from "gl-matrix"

/**
 * Keeps track of the position
 * @param {Entity} e The entity to attach the component to
 * @param {Number[]} elements The coordinates
 */
export function position(e, elements) {
	if (!elements) return vec2.create()
	else if (elements instanceof Array) return vec2.fromValues(...elements)
	else return elements
}

export function update(game) {}

export { position as component }
export const name = "position"
export const order = _order[name]
