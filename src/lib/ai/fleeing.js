import { byPosition, canSee } from "../tools"
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
		data: { tooCloseRange },
		state,
	} = entity.ai
	let pos = entity.position

	if (
		closestSnake.position.distanceFrom(pos) > tooCloseRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "PLAYER_FAR").value
	} else {
		let d = closestSnake.position.subtract(pos),
			dx = d.e(1),
			dy = d.e(2)
		let moveTo = pos.dup()
		// TODO: Clearer
		if (Math.abs(dx) > Math.abs(dy))
			moveTo = moveTo.subtract([Math.sign(dx) ** (!dx ? 0 : 1), 0])
		else moveTo = moveTo.subtract([0, Math.sign(dy) ** (!dy ? 0 : 1)])

		// we check if the way is clear and move
		let canMove = !findByComponent("position")
			.filter(byPosition(moveTo))
			.some(e => e.hitbox)
		if (canMove) entity.position = moveTo
	}
	return state
}
