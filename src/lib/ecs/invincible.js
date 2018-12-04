import _order from "./order.json"
import { findByComponent } from "geotic"
import { addModifier, removeModifier } from "./sprite"
import { modifiers } from "../blocks.js"

/**
 * A container for invincibility data
 * @param {Entity} e The entity to attach the component to
 * @param {Number} time how many ticks to stay invincible
 */
export function invincible(e, duration = 20) {
	addModifier(e, modifiers.highlight)
	e.hitbox && (e.hitbox.canBeKilled = false)
	return { duration, time: 0, remaining: duration }
}

export function update(game) {
	findByComponent("invincible").forEach(e => {
		let { time, duration, remaining } = e.invincible
		if (remaining > 0) {
			let addOrRemove = game.time % 4 < 2 ? addModifier : removeModifier
			addOrRemove(e, modifiers.highlight)
			e.invincible.time = ++time
			e.invincible.remaining = duration - time
		} else {
			e.remove("invincible")
			removeModifier(e, modifiers.highlight)
			e.hitbox && (e.hitbox.canBeKilled = true)
			e.emit("invincible-end")
		}
	})
}

export { invincible as component }
export const name = "invincible"
export const order = _order[name]
