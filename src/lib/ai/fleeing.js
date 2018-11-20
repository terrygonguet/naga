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
		data: { tooCloseRange },
		state,
	} = entity.ai
	let pos = entity.position
	let distanceTo = make_distanceTo(pos)

	if (distanceTo(closestSnake.position) > tooCloseRange) {
		state = machine.transition(state, "PLAYER_FAR").value
	} else {
		let dx = closestSnake.position.x - pos.x,
			dy = closestSnake.position.y - pos.y
		let moveTo = { ...pos }
		if (Math.abs(dx) > Math.abs(dy)) moveTo.x -= Math.sign(dx) ** (!dx ? 0 : 1)
		else moveTo.y -= Math.sign(dy) ** (!dy ? 0 : 1)

		// we check if the way is clear and move
		let canMove = !findByComponent("position")
			.filter(byPosition(moveTo))
			.some(e => e.hitbox)
		if (canMove) entity.position = moveTo
	}
	return state
}
