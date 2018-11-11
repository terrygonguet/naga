import { entity, findById, findByComponent } from "geotic"
import {
	directions,
	turnLeft,
	turnRight,
	oppositeDirection,
} from "../directions"
import { blocks } from "../blocks"
import _findKey from "lodash/findKey"
import { make_cmpPos } from "../tools"
import _order from "./order.json"

/**
 * Creates an entity for the snake head oriented towards direction
 * @param params
 * @param {Number} params.x
 * @param {Number} params.y
 * @param {Direction} params.direction
 * @returns {Entity}
 */
function make_head({ x, y, direction }) {
	return entity()
		.add("position", { x, y })
		.add("fov")
		.add("sprite", {
			type:
				blocks.snakeHead[_findKey(directions, d => d === direction) || "right"],
			isBackground: false,
		})
}

/**
 * A snake
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.length]
 * @param {Number} [params.x]
 * @param {Number} [params.y]
 */
export function snake(e, { length = 4, x = 4, y = 4 }) {
	return {
		length,
		head: null,
		body: [],
		lastDirection: null,
		mount() {
			let head = make_head({ x, y, direction: "right" })
			e.snake.head = head.id
			e.snake.body.push(head.id)
		},
		unmount() {
			e.snake.body.forEach(ent => findById(ent).destroy())
		},
	}
}

export function update(game) {
	let { snake, controller } = game.snake

	let canMove = false,
		tries = 2,
		nextPos,
		direction,
		oldHead = findById(snake.head)
	// TODO : fix "turn around" bug
	do {
		nextPos = { ...oldHead.position }
		direction = controller.direction
		if (direction === oppositeDirection(snake.lastDirection))
			direction = snake.lastDirection

		if (tries === 1) direction = turnRight(direction)
		else if (tries === 0) direction = turnLeft(direction)

		switch (direction) {
			case directions.up:
				nextPos.y--
				break
			case directions.down:
				nextPos.y++
				break
			case directions.left:
				nextPos.x--
				break
			case directions.right:
				nextPos.x++
				break
		}

		let cmpPos = make_cmpPos(nextPos)
		let nextCell = findByComponent("position").find(ent => cmpPos(ent.position))
		if (nextCell?.hitbox?.blocksMoving) {
			tries--
		} else canMove = true

		if (nextCell?.hitbox?.canBeKilled) {
			nextCell?.destroy()
			snake.length++
		}

		if (tries < 0) return game.die()
	} while (!canMove)

	snake.lastDirection = direction
	controller.direction = direction

	// when the block becomes body it becomes snake
	// and loses the fov component
	oldHead.remove("fov").sprite.type = blocks.snake

	let head = make_head({ ...nextPos, direction })
	snake.head = head.id
	snake.body.push(head.id)
	if (snake.body.length > snake.length) findById(snake.body.shift()).destroy()
}

export { snake as component }
export const name = "snake"
export const order = _order[name]
