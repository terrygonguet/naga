import { make_distanceTo, byPosition } from "../tools"
import { findByComponent } from "geotic"
import line from "bresenham-line"

/**
 * state update function for "idle"
 * @param {Object} params
 * @param {Object} params.entity
 * @param {Object} params.closestSnake
 * @param {Object} params.game
 * @param {Object} params.machine
 */
export function update({ entity, closestSnake, game, machine }) {
	let {
		data: { chanceToMove, sightRange },
		state,
		target,
	} = entity.ai
	let distanceTo = make_distanceTo(entity.position)

	if (game.rng() < chanceToMove) randomMove(entity, game.rng)

	// if the player is in range we check line of sight
	if (distanceTo(closestSnake.position) <= sightRange) {
		let canSee = true
		for (const point of line(entity.position, closestSnake.position)) {
			canSee = !findByComponent("position")
				.filter(byPosition(point))
				.some(e => e?.hitbox?.blocksSight)
			if (!canSee) break
		}

		if (canSee) return machine.transition(state, "SEE_PLAYER").value
	}
	return state
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
