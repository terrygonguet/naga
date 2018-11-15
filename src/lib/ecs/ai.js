import { blocks, modifiers, animations } from "../blocks"
import { findByComponent, findById, findByTag } from "geotic"
import { cmpPts, findByCanTick, make_distanceTo, byPosition } from "../tools"
import _order from "./order.json"
import { Machine } from "xstate"
import line from "bresenham-line"
import { addModifier, removeModifier } from "./sprite"

let aimachine = Machine({
	id: "ai",
	initial: "idle",
	states: {
		idle: {
			on: {
				SEE_PLAYER: "chasing",
			},
		},
		chasing: {
			on: {
				LOSE_SIGHT: "idle",
			},
		},
	},
})

/**
 * Move around randomly for now
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.chanceToMove]
 * @param {Number} [params.sightRange]
 */
export function ai(e, { chanceToMove = 0.4, sightRange = 10 } = {}) {
	return { chanceToMove, sightRange, state: aimachine.initial, target: null }
}

export function update(game) {
	findByCanTick("ai").forEach(ent => {
		if (!ent.position) return

		let { chanceToMove, sightRange, state, target } = ent.ai
		let pos = ent.position
		let distanceTo = make_distanceTo(pos)
		let closestSnake = findByTag("snake").sort((a, b) =>
			distanceTo(a.position) < distanceTo(b.position) ? -1 : 1
		)[0]
		if (!closestSnake) return // whatever

		switch (state) {
			case "idle":
				if (game.rng() < chanceToMove) randomMove(ent, game.rng)

				// if the player is in range we check line of sight
				if (distanceTo(closestSnake.position) <= sightRange) {
					let canSee = true
					for (const point of line(pos, closestSnake.position)) {
						canSee = !findByComponent("position")
							.filter(byPosition(point))
							.some(e => e?.hitbox?.blocksSight)
						if (!canSee) break
					}

					// attack if visible
					if (canSee) {
						ent.ai.state = aimachine.transition(state, "SEE_PLAYER").value
						ent.ai.target = findByComponent("snake")[0].id
						addModifier(ent, modifiers.transparent)
					}
				}
				break
			case "chasing":
				// TODO : pathfinding
				// TODO : flip sprite to look at player
				if (distanceTo(closestSnake.position) > sightRange) {
					ent.ai.state = aimachine.transition(state, "LOSE_SIGHT").value
					removeModifier(ent, modifiers.transparent)
				} else {
					let dx = closestSnake.position.x - pos.x,
						dy = closestSnake.position.y - pos.y
					let moveTo = { ...pos }
					if (Math.abs(dx) > Math.abs(dy)) moveTo.x += Math.sign(dx)
					else moveTo.y += Math.sign(dy)
					let canMove = !findByComponent("position")
						.filter(byPosition(moveTo))
						.some(e => e.hitbox)
					if (canMove) ent.position = moveTo // TODO : attack
				}
				break
		}
	})
}

function randomMove(entity, rng) {
	let { x, y } = entity.position
	// add +/-1 to either x or y
	rng() < 0.5
		? (x += (-1) ** Math.round(rng()))
		: (y += (-1) ** Math.round(rng()))

	let canMove = !findByComponent("position")
		.filter(byPosition({ x, y }))
		.some(e => e.hitbox)
	if (canMove) entity.position = { x, y }
}

export { ai as component }
export const name = "ai"
export const order = _order[name]
