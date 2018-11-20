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
		data: { chanceToMove, sightRange },
		state,
		target,
	} = entity.ai
	let pos = entity.position
	let distanceTo = make_distanceTo(pos)
	// TODO : pathfinding
	// TODO : flip sprite to look at player
	if (distanceTo(closestSnake.position) > sightRange) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else {
		let dx = closestSnake.position.x - pos.x,
			dy = closestSnake.position.y - pos.y
		let moveTo = { ...pos }
		if (Math.abs(dx) > Math.abs(dy)) moveTo.x += Math.sign(dx)
		else moveTo.y += Math.sign(dy)

		// if it's not the head and we can reach snake we attack
		let isHead =
			findById(closestSnake.tags.snake.id).snake.head === closestSnake.id
		if (!isHead && cmpPts(moveTo, closestSnake.position)) {
			closestSnake.emit("hit", entity.id)
		} else {
			// we check if the way is clear and move
			let canMove = !findByComponent("position")
				.filter(byPosition(moveTo))
				.some(e => e.hitbox)
			if (canMove) entity.position = moveTo
		}
	}
	return state
}
