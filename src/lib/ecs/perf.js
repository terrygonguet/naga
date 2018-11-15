import { findByComponent } from "geotic"
import _order from "./order.json"

/**
 * Shows performance stats
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.captureLength]
 */
export function perf(e, { captureLength = 50 } = {}) {
	return {
		deltas: [],
		captureLength,
		old: 0,
		mount() {
			let el = document.createElement("span")
			el.id = "tps"
			el.style.position = "absolute"
			el.style.top = "1rem"
			el.style.left = "1rem"
			el.style.fontFamily = "Monospace"
			el.style.fontSize = "1.6rem"
			document.body.append(el)
		},
		unmount() {
			document.querySelector("#tps").remove()
		},
	}
}

export function update(game) {
	findByComponent("perf").forEach(ent => {
		let now = performance.now()
		let { deltas, captureLength, old } = ent.perf
		deltas.push(now - old)
		if (deltas.length > captureLength) deltas.shift()
		ent.perf.old = now

		let avg = deltas.reduce((acc, cur) => acc + cur, 0) / deltas.length
		let el = document.querySelector("#tps")
		el && (el.innerHTML = `${(1000 / avg).toFixed(2)} TPS`)
	})
}

export { perf as component }
export const name = "perf"
export const order = _order[name]
