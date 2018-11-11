import { directions } from "../directions"
import _order from "./order.json"

/**
 * Keeps track of the last direction the player pushed
 * @param {Entity} e The entity to attach the component to
 */
export function controller(e) {
	let listener = evt =>
		Object.values(directions).includes(evt.key) &&
		(e.controller.direction = evt.key)
	return {
		direction: null,
		mount() {
			document.addEventListener("keydown", listener)
		},
		unmount() {
			document.removeEventListener("keydown", listener)
		},
	}
}

export function update(game) {}

export { controller as component }
export const name = "controller"
export const order = _order[name]
