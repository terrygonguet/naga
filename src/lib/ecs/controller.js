import { directions } from "../directions"

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
