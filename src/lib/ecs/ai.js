import { blocks, modifiers } from "../blocks"
import { findByComponent, findById } from "geotic"
import { make_cmpPos, findByCanTick, make_distanceTo } from "../tools"
import _order from "./order.json"
import { Machine } from "xstate"

let aimachine = Machine({
	id: "ai",
	initial: "idle",
	states: {
		idle: {
			on: {
				SEE_PLAYER: "chasing",
			},
		},
		chasing: {
			on: {
				LOSE_SIGHT: "idle",
			},
		},
	},
})

/**
 * Move around randomly for now
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.chanceToMove]
 * @param {Number} [params.sightRange]
 */
export function ai(e, { chanceToMove = 0.4, sightRange = 10 } = {}) {
	return { chanceToMove, sightRange, state: aimachine.initial, target: null }
}

export function update(game) {
	findByCanTick("ai").forEach(ent => {
		if (!ent.position) return

		let { chanceToMove, sightRange, state, target } = ent.ai
		let pos = ent.position
		let distanceTo = make_distanceTo(pos)
		let snake = target ? findById(target) : findByComponent("snake")[0]
		switch (state) {
			case "idle":
				if (game.rng() < chanceToMove) {
					randomMove(ent, game.rng)
				}
				let closestSnake = snake.snake.body
					.map(findById)
					.sort((a, b) =>
						distanceTo(a.position) < distanceTo(b.position) ? -1 : 1
					)[0]
				if (
					closestSnake &&
					distanceTo(closestSnake.position) <= sightRange &&
					true
				) {
					ent.ai.state = aimachine.transition(state, "SEE_PLAYER").value
					ent.ai.target = snake.id
				}
				break
			case "chasing":
				// TODO : recalculate target maybe ?
				// TODO : pathfinding
				let head = findById(snake.snake.head)
				let dx = head.position.x - pos.x,
					dy = head.position.y - pos.y
				let moveTo = { ...pos }
				if (Math.abs(dx) > Math.abs(dy)) moveTo.x += Math.sign(dx)
				else moveTo.y += Math.sign(dy)
				let cmpPos = make_cmpPos(moveTo)
				let entities = findByComponent("position").filter(e =>
					cmpPos(e.position)
				)
				if (!entities.length) ent.position = moveTo
				break
		}
	})
}

function randomMove(entity, rng) {
	let { x, y } = entity.position
	// add +/-1 to either x or y
	rng() < 0.5
		? (x += (-1) ** Math.round(rng()))
		: (y += (-1) ** Math.round(rng()))

	let cmpPos = make_cmpPos({ x, y })
	let entities = findByComponent("position").filter(e => cmpPos(e.position))
	let canMove = true
	for (const e of entities) canMove = canMove && !e?.hitbox
	if (canMove) {
		entity.position = { x, y }
	}
}

export { ai as component }
export const name = "ai"
export const order = _order[name]
