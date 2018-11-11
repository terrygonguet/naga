import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"
import { blocks, animations, walls, doorAndWalls } from "./blocks"

export default class Game {
	seed = Math.random().toString(16)
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

	systems = []

	snake = entity()
	fogOfWar = entity()

	constructor() {
		this.initECS()

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
					.add("hitbox", {
						blocksSight: doorAndWalls.includes(c),
						blocksMoving: walls.includes(c),
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

		entity()
			.add("position", { x: 13, y: 3 })
			.add("sprite", { type: blocks.enemy.red })
			.add("animation", { frames: animations.enemyRed, flipV: true })
			.add("hitbox", { canBeKilled: true })
		entity()
			.add("position", { x: 14, y: 5 })
			.add("sprite", { type: blocks.enemy.green })
			.add("animation", { frames: animations.enemyGreen, flipV: true })
			.add("hitbox", { canBeKilled: true })

		// first update
		this.tick()

		console.log(this)
	}

	initECS() {
		if (this.systems.length) return
		const context = require.context("./ecs", false, /\.js$/)

		for (const path of context.keys()) {
			let { name, update, component: comp, order } = context(path)
			update.order = order
			component(name, comp)
			this.systems.push(update)
		}

		this.systems.sort((a, b) => a.order > b.order)
	}

	tick() {
		this.systems.forEach(s => s(this))
	}

	die() {
		this.snake.destroy()
	}
}
