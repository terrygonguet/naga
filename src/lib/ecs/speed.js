import { findByComponent } from "../geotic"
import _order from "./order.json"

/**
 * Move around randomly for now
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} params.speed a number of ticks per second inside [0:20]
 */
export function speed(e, { speed } = {}) {
	return { ticksEvery: 20 / speed, startTick: null, canTick: false }
}

export function update(game) {
	findByComponent("speed").forEach(ent => {
		let speed = ent.speed
		// if it's the first update of the component
		if (speed.startTick === null) {
			speed.startTick = game.time
		}
		speed.canTick = (game.time - speed.startTick) % speed.ticksEvery < 1
	})
}

export { speed as component }
export const name = "speed"
export const order = _order[name]
