import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"

export let directions = {
	up: "ArrowUp",
	left: "ArrowLeft",
	down: "ArrowDown",
	right: "ArrowRight",
}

export function setDirections({ up, down, left, right }) {
	directions = { up, down, left, right }
}

export function oppositeDirection(direction) {
	switch (direction) {
		case directions.up:
			return directions.down
		case directions.down:
			return directions.up
		case directions.left:
			return directions.right
		case directions.right:
			return directions.left
		default:
			return null
	}
}

export function turnRight(direction) {
	switch (direction) {
		case directions.up:
			return directions.right
		case directions.down:
			return directions.left
		case directions.left:
			return directions.up
		case directions.right:
			return directions.down
		default:
			return null
	}
}

export function turnLeft(direction) {
	switch (direction) {
		case directions.up:
			return directions.left
		case directions.down:
			return directions.right
		case directions.left:
			return directions.down
		case directions.right:
			return directions.up
		default:
			return null
	}
}

export default class Game {
	width = 46
	height = 46
	roomWidth = 10
	roomHeight = 10
	lastDirection = null

	seed = "suce ma bite2"
	rng = seedrandom(this.seed)

	snake = entity()
	fruit = null
	grid = createDungeon({ ...this, nbRoomW: 5, nbRoomH: 5 })

	constructor() {
		this.grid.forEach(
			(c, i) =>
				c === "wall" &&
				entity().add("position", {
					x: i % this.width,
					y: Math.floor(i / this.width),
					type: "wall",
				})
		)

		this.snake
			.add("tail", {
				x: 4,
				y: 4,
				length: 4,
			})
			.add("controller")
		console.log(this)
	}

	tick() {
		systems.forEach(s => s(this))
	}

	die() {
		this.snake.destroy()
	}

	cell({ x, y, type }) {
		if (type) this.grid[x + y * this.width] = type
		else return this.grid[x + y * this.width]
	}
}

// components - systems
let systems = []

function tail(e, { length, x, y }) {
	return {
		length,
		head: null,
		entities: [],
		lastDirection: null,
		mount() {
			let head = entity()
			head.add("position", { x, y, type: "snake" })
			e.tail.head = head.id
			e.tail.entities.push(head.id)
		},
		unmount() {
			e.tail.entities.forEach(ent => findById(ent).destroy())
		},
	}
}
component("tail", tail)
systems.push(function(game) {
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
			let {
				position: { type },
			} = nextCell
			if (type === "wall") {
				tries--
			} else canMove = true
		} else canMove = true

		if (tries < 0) return game.die()
	} while (!canMove)

	tail.lastDirection = direction
	controller.direction = direction

	let head = entity().add("position", nextPos)
	tail.head = head.id
	tail.entities.push(head.id)
	if (tail.entities.length > tail.length)
		findById(tail.entities.shift()).destroy()
})

function controller(e) {
	let listener = evt =>
		Object.values(directions).includes(evt.key) &&
		(e.controller.direction = evt.key)
	return {
		direction: null,
		mount() {
			document.addEventListener("keydown", listener)
		},
		unmount() {
			document.removeEventListener("keydown", listener)
		},
	}
}
component("controller", controller)

function position(e, { x, y, type }) {
	return { x, y, type }
}
component("position", position)
systems.push(function(game) {
	game.grid = game.grid.map(() => "empty")
	findByComponent("position").forEach(ent => {
		game.cell(ent.position)
	})
})
