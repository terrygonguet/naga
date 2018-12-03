import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById } from "geotic"
import { createDungeon } from "./dungeon"
import { make_i2xy, byPosition } from "./tools"
import { blocks, animations, walls, doorAndWalls } from "./blocks"

import { make as makeSlime } from "./prefabs/slime"
import { make as makeWizard } from "./prefabs/wizard"
import { make as makeSnake } from "./prefabs/snake"
import { make as makeBlock } from "./prefabs/block"

/* good seeds :
"0.37a6adc41497a"
*/

export default class Game {
	seed = Date.now().toString(36)
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
				makeBlock({
					position: [i % this.width, Math.floor(i / this.width)],
					type: c,
				})
		)

		makeSnake()

		entity().add("fogOfWar", {
			width: this.width,
			height: this.height,
		})

		// make some enemies on empty spaces
		let max = 20 + Math.round(this.rng() * 10)
		let i2xy = make_i2xy(this.width)
		for (let i = 0; i < max; i++) {
			let { x, y } = i2xy(Math.floor(this.rng() * this.foreground.length))
			let position = [x, y]
			let cell = findByComponent("position").find(byPosition(position))
			if (cell) {
				i--
				continue
			}

			this.rng() > 0.2
				? makeSlime({
						position,
						isRed: this.rng() < 0.5,
						flipAnim: this.rng() < 0.5,
						flipV: this.rng() < 0.5,
				  })
				: makeWizard({
						position,
						flipAnim: this.rng() < 0.5,
						flipV: this.rng() < 0.5,
				  })
		}

		if (process.env.NODE_ENV === "development") entity().add("perf")

		// first update
		this.tick()

		console.log(this, findByComponent, findById)
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
