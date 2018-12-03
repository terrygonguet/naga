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
		data: { sightRange },
		state,
		target,
	} = entity.ai
	let pos = entity.position
	// TODO : pathfinding
	entity.animation.flipV = closestSnake.position.subtract(pos).e(1) < 0
	if (
		closestSnake.position.distanceFrom(pos) > sightRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else {
		let d = closestSnake.position.subtract(pos),
			dx = d.e(1),
			dy = d.e(2)
		let moveTo = pos.dup()
		if (Math.abs(dx) > Math.abs(dy)) moveTo = moveTo.add([Math.sign(dx), 0])
		else moveTo = moveTo.add([0, Math.sign(dy)])

		// if it's not the head and we can reach snake we attack
		let isHead =
			findById(closestSnake.tags.snake.id).snake.head === closestSnake.id
		if (!isHead && moveTo.eql(closestSnake.position)) {
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
