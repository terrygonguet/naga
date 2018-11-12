import { entity, findById, findByComponent } from "geotic"
import { directions, turnLeft, turnRight, reverse } from "../directions"
import { blocks, modifiers } from "../blocks"
import {
	findKey as _findKey,
	values as _values,
	fromPairs as _fromPairs,
} from "lodash"
import { make_cmpPos } from "../tools"
import _order from "./order.json"
import { addModifier, removeModifier } from "./sprite"
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
		invulnerable: 0,
		mount() {
			let head = make_head({ x, y, direction: "right" })
			e.snake.head = head.id
			e.snake.body.push(head.id)
			e.on("hit", () => {
				let snake = e.snake
				if (!snake.invulnerable) {
					if (--snake.length < 2) e.destroy()
					else snake.invulnerable = 10
				}
			})
		},
		unmount() {
			e.snake.body.forEach(ent => findById(ent).destroy())
		},
	}
}

export function update(game) {
	let { snake, controller } = game.snake
	if (!controller?.direction && !snake?.lastDirection) return

	let direction = getDirection({ snake, controller })
	let canMove = getPossibleDirections(snake)

	// find the first direction we can go in
	direction = [
		direction,
		turnRight(direction),
		turnLeft(direction),
		reverse(direction),
	].find(dir => canMove[dir])
	// ye done goof'd
	if (!direction) return game.die()

	let nextPos = getNextPos({ snake, direction })
	let cmpPos = make_cmpPos(nextPos)
	let entities = findByComponent("position").filter(e => cmpPos(e.position))

	for (const ent of entities) {
		if (ent?.hitbox?.canBeKilled) {
			ent.emit("hit")
			snake.length++
		}
	}

	snake.lastDirection = direction
	controller.direction = direction

	let oldHead = findById(snake.head)
	// when the block becomes body it becomes snake
	oldHead.sprite.type = blocks.snake

	let head = make_head({ ...nextPos, direction })
	snake.head = head.id
	snake.body.push(head.id)
	if (snake.body.length > snake.length) findById(snake.body.shift()).destroy()

	if (snake.invulnerable && snake.invulnerable-- % 2)
		snake.body.forEach(b => addModifier(findById(b), modifiers.highlight))
	else snake.body.forEach(b => removeModifier(findById(b), modifiers.highlight))
}

/**
 * Creates an entity for the snake head oriented towards direction
 * @param params
 * @param {Number} params.x
 * @param {Number} params.y
 * @param {Direction} params.direction
 * @returns {Entity}
 */
function make_head({ x, y, direction }) {
	return (
		entity()
			.add("position", { x, y })
			.add("fov")
			// .add("hitbox", { blocksMoving: true }) lol
			.add("sprite", {
				type:
					blocks.snakeHead[
						_findKey(directions, d => d === direction) || "right"
					],
				isBackground: false,
			})
	)
}

/**
 * Returns the position if the cell in the supplied direction
 * relative to the snake's head
 * @param {Object} params
 * @param {Object} params.snake The snake component
 * @param {String} params.direction
 * @returns {Object} { x, y }
 */
function getNextPos({ snake, direction }) {
	let nextPos = { ...findById(snake.head).position }

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

	return nextPos
}

/**
 * Returns the controller.direction if valid,
 * snake.lastDirection else
 * @param {Object} params
 * @param {Object} params.snake snake component
 * @param {Object} params.controller controller component
 * @returns {String}
 */
function getDirection({ snake, controller }) {
	let direction = controller.direction
	if (direction === reverse(snake.lastDirection))
		direction = snake.lastDirection
	return direction
}

/**
 * Returns an object with the directions as keys
 * and a bool value if the snake can move there
 * @param {Object} snake snake component
 * @returns {Object} { <direction.p>: Boolean, ...}
 */
function getPossibleDirections(snake) {
	let opposite = reverse(snake.lastDirection)
	let canMove = _values(directions).map(direction => {
		if (direction === opposite) return [direction, false]
		let nextPos = getNextPos({ snake, direction })
		let cmpPos = make_cmpPos(nextPos)
		let blockingEntities = findByComponent("position")
			.filter(e => cmpPos(e.position))
			.some(e => e?.hitbox?.blocksMoving)
		return [direction, !blockingEntities]
	})
	return _fromPairs(canMove)
}

export { snake as component }
export const name = "snake"
export const order = _order[name]
