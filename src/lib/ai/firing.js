import { canSee } from "../tools"
import { findByComponent } from "geotic"
import { make } from "../prefabs/magicMissile"

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

	if (closestSnake.position.distanceFrom(pos) <= tooCloseRange) {
		state = machine.transition(state, "PLAYER_CLOSE").value
	} else if (
		closestSnake.position.distanceFrom(pos) > sightRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else if (game.time % (20 / fireRate) < 0.0001) {
		let direction = closestSnake.position.subtract(pos)
		make({ position: pos, direction, speed: 5 })
	}
	return state
}
