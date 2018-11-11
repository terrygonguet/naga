import _order from "./order.json"

/**
 * Keeps track of the position
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.x]
 * @param {Number} [params.y]
 */
export function position(e, { x = 0, y = 0 }) {
	return { x, y }
}

export function update(game) {}

export { position as component }
export const name = "position"
export const order = _order[name]
