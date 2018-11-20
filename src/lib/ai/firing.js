import { make_distanceTo, cmpPts, byPosition } from "../tools"
import { findByComponent, findById } from "geotic"

/**
 * state update function for "chasing"
 * @param {Object} params
 * @param {Object} params.entity
 * @param {Object} params.closestSnake
 * @param {Object} params.game
 * @param {Object} params.machine
 */
export function update({ entity, closestSnake, game, machine }) {
	let {
		data: { sightRange, tooCloseRange, fireRate },
		state,
	} = entity.ai
	let pos = entity.position
	let distanceTo = make_distanceTo(pos)

	if (distanceTo(closestSnake.position) <= tooCloseRange) {
		state = machine.transition(state, "PLAYER_CLOSE").value
	} else if (distanceTo(closestSnake.position) > sightRange) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else if (game.time % fireRate < 1) {
		// we shoot
		let snake = findByComponent("snake")[0]
		snake.emit("hit", entity.id)
	}
	return state
}
