import _order from "./order.json"

/**
 * A container for template data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function template(e, {} = {}) {
	return {}
}

export function update(game) {}

export { template as component }
export const name = "template"
export const order = 0 // _order[name]
