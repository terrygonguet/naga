import _order from "./order.json"

export function position(e, { x, y }) {
	return { x, y }
}

export function update(game) {}

export { position as component }
export const name = "position"
export const order = _order[name]
