import _order from "./order.json"
import { findByComponent } from "geotic"
import { findByCanTick, make_isInBounds, byPosition } from "../tools.js"
import { vec2 } from "gl-matrix"

/**
 * A container for projectile data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function projectile(e, { direction } = {}) {
	let floatPosition = vec2.add(vec2.create(), e.position, [0.5, 0.5])
	return { direction: vec2.normalize(vec2.create(), direction), floatPosition }
}

export function update(game) {
	findByCanTick("projectile").forEach(e => {
		let { floatPosition, direction } = e.projectile
		vec2.add(floatPosition, floatPosition, direction)

		if (make_isInBounds(game)(...floatPosition)) {
			vec2.floor(e.position, floatPosition)
			let blockingEnt = findByComponent("position")
				.filter(byPosition(e.position))
				.find(ent => ent?.hitbox?.blocksMoving)
			blockingEnt?.emit("hit", e.id) && e.destroy()
		} else {
			e.destroy()
		}
	})
}

export { projectile as component }
export const name = "projectile"
export const order = _order[name]
