import { canSee, isPositionBlocked } from "../tools"
import { findByComponent, findById, getTag } from "geotic"
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
		data: { sightRange },
		state,
		target,
	} = entity.ai
	if (!closestSnake) return entity.ai.state

	let pos = entity.position
	// TODO : pathfinding
	entity.animation.flipV = closestSnake.position[0] - pos[0] < 0
	if (
		vec2.distance(closestSnake.position, pos) > sightRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else {
		let dx = closestSnake.position[0] - pos[0],
			dy = closestSnake.position[1] - pos[1]
		let moveTo = vec2.clone(pos)

		if (Math.abs(dx) > Math.abs(dy)) moveTo[0] += Math.sign(dx)
		else moveTo[1] += Math.sign(dy)

		// if it's not the head and we can reach snake we attack
		let isHead = findById(getTag("player").id).snake.head === closestSnake.id
		if (!isHead && vec2.equals(moveTo, closestSnake.position)) {
			closestSnake.emit("hit", entity.id)
		} else {
			// we check if the way is clear and move
			let canMove = !isPositionBlocked(moveTo)
			if (canMove) vec2.copy(pos, moveTo)
		}
	}
	return state
}
