import { entity, findById, findByComponent } from "geotic"
import {
	directions,
	turnLeft,
	turnRight,
	reverse,
	vectors,
} from "../directions"
import { blocks, modifiers } from "../blocks"
import {
	findKey as _findKey,
	values as _values,
	fromPairs as _fromPairs,
} from "lodash"
import {
	findByCanTick,
	findByPosition,
	isPositionBlocked,
	haveHitbox,
} from "../tools"
import _order from "./order.json"
import { addModifier, removeModifier } from "./sprite"
import { vec2 } from "gl-matrix"

/**
 * A snake
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Number} [params.length]
 * @param {Number} [params.x]
 * @param {Number} [params.y]
 */
export function snake(
	e,
	{ length = 4, position = vec2.fromValues(4, 4) } = {}
) {
	return {
		length,
		head: null,
		body: [],
		lastDirection: null,
		mount() {
			let head = make_head({
				position,
				direction: "right",
				snakeId: e.id,
			})
			e.snake.head = head.id
			e.snake.body.push(head.id)
			e.on("hit", id => {
				let snake = e.snake
				if (e.has("invincible")) return
				e.add("invincible", 10).once("invincibleend", () => {
					snake.body.forEach(b => {
						findById(b).hitbox.blocksMoving = true
					})
				})

				snake.body.forEach(b => {
					let bodyPart = findById(b)
					bodyPart.hitbox.blocksMoving = false
					bodyPart.add("invincible", 10)
				})

				if (--snake.length < 2) e.destroy()
			})
		},
		unmount() {
			e.snake.body.forEach(ent => findById(ent).destroy())
		},
	}
}

export function update(game) {
	let snakeEntity = findByCanTick("snake")[0]
	let { snake, controller } = snakeEntity || {}
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
	if (!direction) {
		snakeEntity.emit("hit", snakeEntity.id)
		// recalculate direction after the body has become passable
		direction = getDirection({ snake, controller })
		canMove = getPossibleDirections(snake)
		direction = [
			direction,
			turnRight(direction),
			turnLeft(direction),
			reverse(direction),
		].find(dir => canMove[dir])
		// Now we're really stuck
		if (!direction) return snakeEntity.destroy()
	}

	let nextPos = getNextPos({ snake, direction })
	let entities = findByPosition(nextPos)
		.filter(haveHitbox({ canBeKilled: true }))
		.forEach(e => {
			e?.hitbox?.givesLength && snake.length++
			e.emit("hit", snakeEntity.id)
		})

	snake.lastDirection = direction
	controller.direction = direction

	let oldHead = findById(snake.head)
	// when the block becomes body it becomes snake
	oldHead.sprite.texture = blocks.snake

	let head = make_head({
		position: nextPos,
		direction,
		snakeId: snakeEntity.id,
	})
	snake.head = head.id
	snake.body.push(head.id)
	// we can remove more than on segment per tick if we get hit
	while (snake.body.length > snake.length) {
		findById(snake.body.shift()).destroy()
	}
}

/**
 * Creates an entity for the snake head oriented towards direction
 * @param params
 * @param {Number} params.x
 * @param {Number} params.y
 * @param {Direction} params.direction
 * @param {Number} params.snakeId
 * @returns {Entity}
 */
function make_head({ position, direction, snakeId }) {
	let snakeEnt = findById(snakeId)
	let e = entity()
		.add("position", position)
		.add("fov")
		.add("hitbox", { blocksMoving: true })
		.add("sprite", {
			texture: blocks.snakeHead,
			layer: "entities",
			modifiers: [_findKey(directions, d => d === direction) || "right"],
		})
		.on("hit", id => {
			snakeEnt.emit("hit", id)
		})
		.tag("snake", { id: snakeId })

	if (snakeEnt.has("invincible")) {
		e.hitbox.blocksMoving = false
		e.add("invincible", snakeEnt.invincible.remaining)
	}
	return e
}

/**
 * Returns the position of the cell in the supplied direction
 * relative to the snake's head
 * @param {Object} params
 * @param {Object} params.snake The snake component
 * @param {String} params.direction
 * @param {vec2|Number[]} [params.out]
 * @returns {Object} { x, y }
 */
function getNextPos({ snake, direction, out = vec2.create() }) {
	return vec2.add(out, findById(snake.head).position, vectors[direction])
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
	let temp = vec2.create()
	let canMove = _values(directions).map(direction => {
		if (direction === opposite) return [direction, false]
		let nextPos = getNextPos({ snake, direction, out: temp })
		return [direction, !isPositionBlocked(nextPos, true)]
	})
	return _fromPairs(canMove)
}

export { snake as component }
export const name = "snake"
export const order = _order[name]
