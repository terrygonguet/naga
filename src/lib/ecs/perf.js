import { findByComponent } from "geotic"
import _order from "./order.json"

/**
 * Shows performance stats
 * @param {Entity} e The entity to attach the component to
 */
export function perf(e) {
	return {
		mount() {
			let el = document.createElement("span")
			el.id = "tps"
			el.style.position = "absolute"
			el.style.top = "1rem"
			el.style.left = "1rem"
			el.style.fontFamily = "Monospace"
			el.style.fontSize = "1.6rem"
			document.body.append(el)
			performance.mark("before_perf")
		},
		unmount() {
			document.querySelector("#tps").remove()
		},
	}
}

export function update(game) {
	findByComponent("perf").forEach(ent => {
		performance.mark("after_perf")

		performance.measure("perf", "before_perf", "after_perf")
		let entries = performance.getEntriesByName("perf", "measure")
		let avg =
			entries.reduce((acc, cur) => acc + cur.duration, 0) / entries.length

		let el = document.querySelector("#tps")
		el && (el.innerHTML = `${(1000 / avg).toFixed(2)} TPS`)

		if (entries.length > 150) {
			performance.clearMarks()
			performance.clearMeasures()
		}

		performance.mark("before_perf")
	})
}

export { perf as component }
export const name = "perf"
export const order = _order[name]
