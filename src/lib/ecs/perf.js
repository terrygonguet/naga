import { findByComponent } from "../geotic"
import _order from "./order.json"

/**
 * Shows performance stats
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.captureLength]
 */
export function perf(e, { captureLength = 5_000 } = {}) {
	return {
		ticks: 0,
		captureLength,
		start: performance.now(),
		mount() {
			el.id = "tps"
			el.style.position = "absolute"
			el.style.top = "1rem"
			el.style.left = "1rem"
			el.style.fontFamily = "Monospace"
			el.style.fontSize = "1.6rem"
			document.body.append(el)
		},
		unmount() {
			el.remove()
		},
	}
}

export function update(game) {
	findByComponent("perf").forEach(ent => {
		let { ticks, captureLength, start } = ent.perf
		let time = performance.now() - start
		ent.perf.ticks++

		if (time > captureLength) {
			ent.perf.ticks = 1
			ent.perf.start = performance.now()
		}

		el.innerHTML = `${((ticks / time) * 1000).toFixed(2)} TPS`
	})
}

let el = document.createElement("span")

export { perf as component }
export const name = "perf"
export const order = _order[name]
