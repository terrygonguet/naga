import _order from "./order.json"
import { findByComponent } from "geotic"
import { findByCanTick, make_isInBounds, byPosition } from "../tools.js"

/**
 * A container for projectile data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function projectile(e, { direction } = {}) {
	let floatPosition = e.position.add([0.5, 0.5])
	return { direction: direction.toUnitVector(), floatPosition }
}

export function update(game) {
	findByCanTick("projectile").forEach(e => {
		let { floatPosition, direction } = e.projectile
		floatPosition = floatPosition.add(direction)

		if (make_isInBounds(game)(...floatPosition.elements)) {
			e.projectile.floatPosition = floatPosition
			e.position = floatPosition.map(el => Math.floor(el))
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
