import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById, findByTag } from "geotic"
import { createDungeon } from "./dungeon"
import { make_i2xy, byPosition } from "./tools"
import { blocks, animations, walls, doorAndWalls } from "./blocks"
import { Application, Texture, Spritesheet, Container } from "pixi.js"
import { Vector } from "sylvester-es6/target/Vector"

import spritesImage from "../assets/micro_dungeon_tileset.png"
import spritesData from "../assets/micro_dungeon_tileset.json"

import { make as makeSlime } from "./prefabs/slime"
import { make as makeAprentice } from "./prefabs/apprentice"
import { make as makeWizard } from "./prefabs/wizard"
import { make as makeKnight } from "./prefabs/knight"
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
		nbRoomW: 12,
		nbRoomH: 12,
		rng: this.rng,
	})

	// TODO : fix ugly (probably config file ?)
	width = this.background.width
	height = this.background.height
	foreground = Array(this.width * this.height).fill(null)

	app = new Application({
		view: document.querySelector("#screen"),
		width: innerWidth,
		height: innerHeight,
		autoStart: false,
	})
	stage = this.app.stage
	sheet = null
	layers = {
		background: new Container(),
		entities: new Container(),
		fogOfWar: new Container(),
	}

	systems = []
	time = 0

	constructor() {
		this.initECS()
		this.initDisplay()
	}

	ready() {
		entity().tag("game", this) // global reference

		this.background.forEach((c, i) =>
			makeBlock({
				position: [i % this.width, Math.floor(i / this.width)],
				texture: c,
			})
		)

		let { width, height } = this.layers.background
		this.stage.position.set(
			Math.round(innerWidth / 2 - width / 2),
			Math.round(innerHeight / 2 - height / 2)
		)
		// TODO : find where to put that
		setTimeout(() => {
			this.layers.background.cacheAsBitmap = true
		}, 2000)

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
			let canSpawn = !findByComponent("position")
				.filter(byPosition(position))
				.some(e => e?.hitbox)
			if (!canSpawn) {
				i--
				continue
			}

			let r = this.rng()
			if (r < 0.1)
				makeWizard({
					position,
					flipAnim: this.rng() < 0.5,
					flipV: this.rng() < 0.5,
				})
			else if (r < 0.2)
				makeAprentice({
					position,
					flipAnim: this.rng() < 0.5,
					flipV: this.rng() < 0.5,
				})
			else if (r < 0.4)
				makeKnight({
					position,
					flipAnim: this.rng() < 0.5,
					flipV: this.rng() < 0.5,
				})
			else
				makeSlime({
					position,
					isRed: this.rng() < 0.5,
					flipAnim: this.rng() < 0.5,
					flipV: this.rng() < 0.5,
				})
		}

		if (process.env.NODE_ENV === "development") {
			entity().add("perf")
			console.log(this)
			console.log(findByComponent, findById, findByTag)
		}

		// first update
		this.tick()
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

		this.systems.sort((a, b) => a.order - b.order)
	}

	initDisplay() {
		this.app.ticker.add(this.displayTick.bind(this))

		let texture = Texture.fromImage(spritesImage)
		this.sheet = new Spritesheet(texture.baseTexture, spritesData, spritesImage)
		this.sheet.parse(() => {
			this.app.start()
			this.stage.addChild(this.layers.background)
			this.stage.addChild(this.layers.entities)
			this.stage.addChild(this.layers.fogOfWar)
			// I don't know why but it needs that
			this.layers.fogOfWar.setTransform(-8, -8)
			this.ready()
		})
	}

	tick() {
		this.systems.forEach(s => s(this))
		this.time++
	}

	displayTick(delta) {
		let { x, y } = this.stage.position
		let cur = new Vector([x, y])
		let snakeHead = findById(findByComponent("snake")[0].snake.head)
		let midScreen = new Vector([innerWidth / 2, innerHeight / 2])
		let target = midScreen.subtract(snakeHead.position.x(16))
		let distance = cur.distanceFrom(target)

		if (distance > 200 || distance < delta) {
			this.stage.position.set(...target.elements)
		} else {
			let direction = target.subtract(cur).toUnitVector()
			cur = cur.add(direction.x(delta)).round()
			this.stage.position.set(...cur.elements)
		}
	}
}
