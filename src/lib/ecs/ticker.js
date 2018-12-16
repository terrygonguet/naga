import _order from "./order.json"
import { findByCanTick } from "../tools.js"

/**
 * A container for ticker data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function ticker(e) {
	return "ticker"
}

export function update(game) {
	findByCanTick("ticker").forEach(e => {
		e.emit("tick")
	})
}

export { ticker as component }
export const name = "ticker"
export const order = 0 // _order[name]
