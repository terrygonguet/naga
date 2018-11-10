import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"
import { tail, update as updateTail } from "./ecs/tail"
import { position, update as updatePosition } from "./ecs/position"
import { controller, update as updateController } from "./ecs/controller"

component("tail", tail)
component("position", position)
component("controller", controller)

export default class Game {
	seed = "suce ma bite2"
	rng = seedrandom(this.seed)

	snake = entity()
	grid = createDungeon({
		roomWidth: 10,
		roomHeight: 10,
		nbRoomW: 5,
		nbRoomH: 5,
		rng: this.rng,
	})

	width = this.grid.width
	height = this.grid.height

	systems = [updateController, updateTail, updatePosition]

	constructor() {
		this.grid.forEach(
			(c, i) =>
				c !== "empty" &&
				entity().add("position", {
					x: i % this.width,
					y: Math.floor(i / this.width),
					type: c,
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
		this.systems.forEach(s => s(this))
	}

	die() {
		this.snake.destroy()
	}

	cell({ x, y, type }) {
		if (type) this.grid[x + y * this.width] = type
		else return this.grid[x + y * this.width]
	}
}
