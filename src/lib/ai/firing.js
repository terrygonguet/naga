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
		data: { sightRange, tooCloseRange, fireRate, lastFireTime },
		state,
	} = entity.ai
	let pos = entity.position

	entity.animation.flipV = closestSnake.position.subtract(pos).e(1) < 0
	if (closestSnake.position.distanceFrom(pos) <= tooCloseRange) {
		state = machine.transition(state, "PLAYER_CLOSE").value
	} else if (
		closestSnake.position.distanceFrom(pos) > sightRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else if (!lastFireTime || game.time - lastFireTime > 20 / fireRate) {
		entity.ai.data.lastFireTime = game.time
		let direction = closestSnake.position.subtract(pos)
		make({ position: pos, direction, speed: 5 })
	}
	return state
}
