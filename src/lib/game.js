import seedrandom from "seedrandom"

export let directions = {
	up: "up",
	left: "left",
	down: "down",
	right: "right",
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

export default class Game {
	grid = []
	width = 50
	height = 50
	lost = false
	lastDirection = null

	seed = "suce ma bite2"
	rng = seedrandom(this.seed)

	snakePos = {
		x: Math.floor(this.width / 2),
		y: Math.floor(this.height / 2),
	}
	snake = [this.snakePos]
	snakeLength = 2

	constructor() {
		// init grid
		for (let i = 0; i < this.height * this.width; i++) {
			let x = i % this.width,
				y = Math.floor(i / this.width)
			this.grid.push({
				isWall: isWall({ game: this, x, y }),
				isFruit: false,
				isSnake: false,
				x,
				y,
			})
		}

		// init snake
		this.cell(this.snakePos).isSnake = true

		this.makeFruit()
		console.log(this)
	}

	tick(direction) {
		let nextPos = { ...this.snakePos }
		if (direction === oppositeDirection(this.lastDirection))
			direction = this.lastDirection

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
			default:
				if (!this.lastDirection) return
				else direction = this.lastDirection
		}
		this.lastDirection = direction

		this.snakePos = nextPos
		let snakeCell = this.cell(this.snakePos)
		if (snakeCell.isWall || snakeCell.isSnake) return this.die()
		this.snake.push(this.snakePos)
		snakeCell.isSnake = true

		if (snakeCell.isFruit) {
			this.snakeLength++
			snakeCell.isFruit = false
			this.makeFruit()
		}

		if (this.snake.length > this.snakeLength)
			this.cell(this.snake.shift()).isSnake = false
	}

	makeFruit() {
		let fruitPos = {
			x: Math.floor(1 + this.rng() * (this.width - 2)),
			y: Math.floor(1 + this.rng() * (this.height - 2)),
		}
		this.cell(fruitPos).isFruit = true
	}

	die() {
		this.lost = true
	}

	cell({ x, y }) {
		return this.grid[x + y * this.width]
	}
}

function isWall({ game, x, y }) {
	return x * y === 0 || x === game.width - 1 || y === game.height - 1
}
