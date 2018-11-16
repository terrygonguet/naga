import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"
import { make_i2xy, make_cmpPos, byPosition } from "./tools"
import { blocks, animations, walls, doorAndWalls } from "./blocks"

/* good seeds :
"0.37a6adc41497a"
*/

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
	time = 0

	constructor() {
		this.initECS()

		this.background.forEach(
			(c, i) =>
				c !== blocks.ground &&
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
					.tag("background")
		)

		entity()
			.add("snake")
			.add("controller")
			.add("speed", { speed: 4 })

		entity().add("fogOfWar", {
			width: this.width,
			height: this.height,
		})

		// make some enemies on empty spaces
		let max = 20 + Math.round(this.rng() * 10)
		let i2xy = make_i2xy(this.width)
		for (let i = 0; i < max; i++) {
			let pos = i2xy(Math.floor(this.rng() * this.foreground.length))
			let cell = findByComponent("position").find(byPosition(pos))
			if (cell) {
				i--
				continue
			}
			this.make_enemy(pos)
		}

		if (process.env.NODE_ENV === "development") entity().add("perf")

		// first update
		this.tick()

		console.log(this, findByComponent, findById)
	}

	make_enemy({ x, y }) {
		let isRed = this.rng() < 0.5
		entity()
			.add("position", { x, y })
			.add("sprite", { type: blocks.enemy[isRed ? "red" : "green"] })
			.add("animation", {
				// swap animation sometimes
				frames: animations[isRed ? "enemyRed" : "enemyGreen"]
					.slice()
					.sort(f => (this.rng() < 0.5 ? -1 : 1)),
				flipV: this.rng() > 0.5,
			})
			.add("hitbox", { canBeKilled: true })
			.add("speed", { speed: 2 })
			.add("ai", { chancetoMove: 0.3 }) // if only it was this simple
			.tag("enemy")
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

		this.systems.sort((a, b) => (a.order > b.order ? 1 : -1))
	}

	tick() {
		this.systems.forEach(s => s(this))
		this.time++
	}
}
