import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"

// TODO : auto import
import { snake, update as updateSnake } from "./ecs/snake"
import { position, update as updatePosition } from "./ecs/position"
import { controller, update as updateController } from "./ecs/controller"
import { sprite, update as updateSprite } from "./ecs/sprite"
import { fov, update as updateFov } from "./ecs/fov"
import { fogOfWar, update as updateFoW } from "./ecs/fog_of_war"
component("snake", snake)
component("position", position)
component("controller", controller)
component("sprite", sprite)
component("fov", fov)
component("fogOfWar", fogOfWar)

export default class Game {
	seed = "suce ma bite2"
	rng = seedrandom(this.seed)

	background = createDungeon({
		roomWidth: 9,
		roomHeight: 9,
		nbRoomW: 6,
		nbRoomH: 6,
		rng: this.rng,
	})

	// TODO : fix ugly (probably config file ?)
	width = this.background.width
	height = this.background.height
	foreground = Array(this.width * this.height).fill(null)

	snake = entity()
	fogOfWar = entity()

	systems = [
		updateController,
		updateSnake,
		updatePosition,
		updateSprite,
		updateFov,
		updateFoW,
	]

	constructor() {
		this.background.forEach(
			(c, i) =>
				c !== "empty" &&
				entity()
					.add("position", {
						x: i % this.width,
						y: Math.floor(i / this.width),
					})
					.add("sprite", {
						type: c,
						isBackground: true,
					})
		)

		this.snake
			.add("snake", {
				x: 4,
				y: 4,
				length: 4,
			})
			.add("controller")

		this.fogOfWar.add("fogOfWar", {
			width: this.width,
			height: this.height,
		})

		// first update
		this.tick()

		console.log(this)
	}

	tick() {
		this.systems.forEach(s => s(this))
	}

	die() {
		this.snake.destroy()
	}
}
