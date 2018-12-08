import { byPosition, canSee } from "../tools"
import { findByComponent, findById } from "geotic"
import { vec2 } from "gl-matrix"

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

	entity.animation.flipV = closestSnake.position[0] - pos[0] > 0
	if (
		vec2.distance(closestSnake.position, pos) > tooCloseRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "PLAYER_FAR").value
	} else {
		let dx = closestSnake.position[0] - pos[0],
			dy = closestSnake.position[1] - pos[1]
		let moveTo = vec2.clone(pos)
		// TODO: Clearer
		if (Math.abs(dx) > Math.abs(dy))
			vec2.sub(moveTo, moveTo, [Math.sign(dx) ** (!dx ? 0 : 1), 0])
		else vec2.sub(moveTo, moveTo, [0, Math.sign(dy) ** (!dy ? 0 : 1)])

		// we check if the way is clear and move
		let canMove = !findByComponent("position")
			.filter(byPosition(moveTo))
			.some(e => e.hitbox)
		if (canMove) vec2.copy(pos, moveTo)
	}
	return state
}
