import { make_distanceFrom, byPosition, vectToxy, canSee } from "../tools"
import { findByComponent } from "geotic"
import line from "bresenham-line"
import { Vector } from "sylvester-es6/target/Vector"

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
	let pos = entity.position

	if (game.rng() < chanceToMove) randomMove(entity, game.rng)

	// if the player is in range we check line of sight
	if (
		pos.distanceFrom(closestSnake.position) <= sightRange &&
		canSee(pos, closestSnake.position)
	) {
		return machine.transition(state, "SEE_PLAYER").value
	}
	return state
}

function randomMove(entity, rng) {
	let [x, y] = entity.position.elements
	// add +/-1 to either x or y
	rng() < 0.5
		? (x += (-1) ** Math.round(rng()))
		: (y += (-1) ** Math.round(rng()))

	let canMove = !findByComponent("position")
		.filter(byPosition([x, y]))
		.some(e => e.hitbox)
	if (canMove) entity.position = new Vector([x, y])
}
