import _order from "./order.json"
import { findByComponent } from "geotic"
import { findByCanTick, make_isInBounds, findByPosition } from "../tools.js"
import { vec2 } from "gl-matrix"

/**
 * Events emitted :
 * "outofbouds"
 * "collide" passes the entity it collided with
 * "move"
 */

/**
 * A container for projectile data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function projectile(
	e,
	{ direction, causesDamage = true, pierces = false } = {}
) {
	let floatPosition = vec2.add(vec2.create(), e.position, [0.5, 0.5])
	return {
		direction: vec2.normalize(vec2.create(), direction),
		floatPosition,
		causesDamage,
		pierces,
	}
}

export function update(game) {
	findByCanTick("projectile").forEach(e => {
		let { floatPosition, direction, causesDamage, pierces } = e.projectile
		vec2.add(floatPosition, floatPosition, direction)

		if (make_isInBounds(game)(...floatPosition)) {
			let temp = vec2.floor(vec2.create(), floatPosition)
			// find if we hit something
			let blockingEnt = findByPosition(temp).find(
				ent => ent?.hitbox?.blocksMoving
			)
			// if we hit we emit else just move
			if (blockingEnt) {
				causesDamage && blockingEnt.emit("hit", e.id)
				e.emit("collide", blockingEnt)
				// if piercing we keep moving else we destroy
				if (pierces) {
					vec2.copy(e.position, temp)
					e.emit("move")
				} else e.destroy()
			} else {
				vec2.copy(e.position, temp)
				e.emit("move")
			}
		} else {
			e.emit("outofbounds")
			e.destroy()
		}
	})
}

export { projectile as component }
export const name = "projectile"
export const order = _order[name]
