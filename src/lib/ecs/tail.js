import { entity, findById, findByComponent } from "geotic"
import {
	directions,
	turnLeft,
	turnRight,
	oppositeDirection,
} from "../directions"
import { blocks, walls } from "../blocks"
import _findKey from "lodash/findKey"

export function tail(e, { length, x, y }) {
	return {
		length,
		head: null,
		entities: [],
		lastDirection: null,
		mount() {
			let head = entity()
			head.add("position", { x, y, type: blocks.snakeHeadRight })
			e.tail.head = head.id
			e.tail.entities.push(head.id)
		},
		unmount() {
			e.tail.entities.forEach(ent => findById(ent).destroy())
		},
	}
}

export function update(game) {
	let { tail, controller } = game.snake

	let canMove = false,
		tries = 2,
		nextPos,
		direction
	do {
		nextPos = { ...findById(tail.head).position }
		direction = controller.direction
		if (direction === oppositeDirection(tail.lastDirection))
			direction = tail.lastDirection

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

		let nextCell = findByComponent("position").find(
			ent => nextPos.x === ent.position.x && nextPos.y === ent.position.y
		)
		if (nextCell) {
			if (walls.includes(nextCell.position.type)) {
				tries--
			} else canMove = true
		} else canMove = true

		if (tries < 0) return game.die()
	} while (!canMove)

	tail.lastDirection = direction
	controller.direction = direction

	// when the block becomes body it becomes snake
	findById(tail.head).position.type = blocks.snake
	// get the rotation of the head
	nextPos.type =
		blocks.snakeHead[_findKey(directions, d => d === direction) || "right"]

	let head = entity().add("position", nextPos)
	tail.head = head.id
	tail.entities.push(head.id)
	if (tail.entities.length > tail.length)
		findById(tail.entities.shift()).destroy()
}

export { tail as component }
export const name = "tail"
