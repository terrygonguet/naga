import { entity, findById, findByComponent } from "geotic"
import {
	directions,
	turnLeft,
	turnRight,
	oppositeDirection,
} from "../directions"
import { blocks, walls } from "../blocks"
import _findKey from "lodash/findKey"
import { make_cmpPos } from "../tools"

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

export function snake(e, { length, x, y }) {
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
		if (nextCell) {
			if (walls.includes(nextCell?.sprite.type)) {
				tries--
			} else canMove = true
		} else canMove = true

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
