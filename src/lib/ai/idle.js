import { canSee, isPositionBlocked } from "../tools"
import { findByComponent } from "geotic"
import { vec2 } from "gl-matrix"

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
	if (!closestSnake) return entity.ai.state
	let pos = entity.position

	if (game.rng() < chanceToMove) randomMove(entity, game.rng)

	// if the player is in range we check line of sight
	if (
		vec2.distance(pos, closestSnake.position) <= sightRange &&
		canSee(pos, closestSnake.position)
	) {
		return machine.transition(state, "SEE_PLAYER").value
	}
	return state
}

function randomMove(entity, rng) {
	let [x, y] = entity.position
	// add +/-1 to either x or y
	rng() < 0.5
		? (x += (-1) ** Math.round(rng()))
		: (y += (-1) ** Math.round(rng()))

	let canMove = !isPositionBlocked([x, y])
	if (canMove) vec2.set(entity.position, x, y)
}
