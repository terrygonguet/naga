import { canSee } from "../tools"
import { findByComponent } from "geotic"
import { make as makeMissile } from "../prefabs/projectile"
import { vec2 } from "gl-matrix"
import { animations } from "../blocks"

/**
 * state update function for "firing"
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

	entity.animation.flipV = closestSnake.position[0] - pos[0] < 0
	if (vec2.distance(closestSnake.position, pos) <= tooCloseRange) {
		state = machine.transition(state, "PLAYER_CLOSE").value
	} else if (
		vec2.distance(closestSnake.position, pos) > sightRange ||
		!canSee(pos, closestSnake.position)
	) {
		state = machine.transition(state, "LOSE_SIGHT").value
	} else if (!lastFireTime || game.time - lastFireTime > 20 / fireRate) {
		entity.ai.data.lastFireTime = game.time
		let direction = vec2.sub(vec2.create(), closestSnake.position, pos)
		makeMissile({
			position: pos,
			direction,
			speed: 5,
			frames: animations.magic,
		})
	}
	return state
}
