import { blocks, modifiers } from "../blocks"
import { findByComponent } from "geotic"
import { make_cmpPos } from "../tools"
import _order from "./order.json"

/**
 * Move around randomly for now
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.chanceToMove]
 */
export function ai(e, { chanceToMove = 0.1 } = {}) {
	return { chanceToMove }
}

export function update(game) {
	findByComponent("ai").forEach(ent => {
		if (!ent.position) return

		let { chanceToMove } = ent.ai
		if (game.rng() < chanceToMove) {
			let { x, y } = ent.position
			// add +/-1 to either x or y
			game.rng() < 0.5
				? (x += (-1) ** Math.round(game.rng()))
				: (y += (-1) ** Math.round(game.rng()))

			let cmpPos = make_cmpPos({ x, y })
			let entities = findByComponent("position").filter(e => cmpPos(e.position))
			let canMove = true
			for (const e of entities) canMove = canMove && !e?.hitbox
			if (canMove) {
				ent.position = { x, y }
			}
		}
	})
}

export { ai as component }
export const name = "ai"
export const order = _order[name]
