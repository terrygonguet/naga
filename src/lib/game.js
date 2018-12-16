import seedrandom from "seedrandom"
import { entity, component, findByComponent, findById, findByTag } from "geotic"
import { make_i2xy, isPositionBlocked, findRandomFreePosition } from "./tools"
import { blocks, animations, walls, doorAndWalls } from "./blocks"
import { Application, Texture, Spritesheet, Container, Sprite } from "pixi.js"
import * as PIXI from "pixi.js"
import { vec2 } from "gl-matrix"

import spritesImage from "../assets/micro_dungeon_tileset.png"
import spritesData from "../assets/micro_dungeon_tileset.json"

import { make as makeDungeon } from "./prefabs/dungeon"
import { make as makeSlime } from "./prefabs/slime"
import { make as makeAprentice } from "./prefabs/apprentice"
import { make as makeWizard } from "./prefabs/wizard"
import { make as makeKnight } from "./prefabs/knight"
import { make as makeSnake } from "./prefabs/snake"
import { make as makeKey } from "./prefabs/key"
import { make as makePortal } from "./prefabs/portal"

export default class Game {
	seed = Date.now().toString(36)
	rng = seedrandom(this.seed)

	width = 0
	height = 0
	paused = false

	app = new Application({
		view: document.querySelector("#screen"),
		width: innerWidth,
		height: innerHeight,
		autoStart: false,
		autoResize: true,
		roundPixels: true,
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

	/**
	 * Called when the ECS and Graphics systems are set up
	 */
	ready() {
		let dungeon = makeDungeon({
			roomWidth: 9,
			roomHeight: 9,
			nbRoomW: 12,
			nbRoomH: 12,
			rng: this.rng,
		})
		this.width = dungeon.width
		this.height = dungeon.height

		entity().tag("game", this) // global reference
		entity().add("background", { sprites: dungeon })

		let { width, height } = this.layers.background
		this.stage.position.set(
			innerWidth / 2 - width / 2,
			innerHeight / 2 - height / 2
		)

		makeSnake()
		makeKey({ position: findRandomFreePosition(this) })

		makePortal({ position: findRandomFreePosition(this) })

		entity().add("fogOfWar", {
			width: this.width,
			height: this.height,
		})

		// "Instructions"
		entity()
			.add("position", [2, -2])
			.add("sprite", { texture: blocks.key })
		entity()
			.add("position", [4, -2])
			.add("sprite", { texture: blocks.magic.s7 })
		entity()
			.add("position", [6, -2])
			.add("sprite", { texture: blocks.portal })

		// make some enemies on empty spaces
		let max = this.width + Math.round((this.rng() * this.height) / 2)
		let i2xy = make_i2xy(this.width)
		for (let i = 0; i < max; i++) {
			let position = findRandomFreePosition(this)

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
			else if (r < 0.3)
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
			console.log(vec2)
			console.log(findByComponent, findById, findByTag)
		}

		// first update
		this.tick()
	}

	/**
	 * Registers component factories and gets update functions
	 */
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

	/**
	 * Sets the graphics up and loads the spritesheet
	 */
	initDisplay() {
		this.app.ticker.add(this.displayTick.bind(this))
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

		let texture = Texture.fromImage(spritesImage)
		this.sheet = new Spritesheet(texture.baseTexture, spritesData, spritesImage)
		this.sheet.parse(() => {
			this.app.start()
			this.stage.addChild(this.layers.background)
			this.stage.addChild(this.layers.entities)
			this.stage.addChild(this.layers.fogOfWar)
			// I don't know why but it needs that
			this.layers.entities.setTransform(8, 8)
			this.ready()
		})
	}

	/**
	 * Called 20 times a second
	 */
	tick() {
		if (this.paused) return
		this.systems.forEach(s => {
			try {
				s(this)
			} catch (err) {
				if (process.env.NODE_ENV === "development") {
					this.paused = true
				}
				console.error(err)
			}
		})
		this.time++
	}

	/**
	 * Called every raf
	 * @param {Number} delta
	 */
	displayTick(delta) {
		let { x, y } = this.stage.position
		let cur = [x, y]
		let snakeEnt = findByComponent("snake")[0]
		if (!snakeEnt) return
		let snakeHead = findById(snakeEnt.snake.head)
		let hpos = snakeHead.position
		let midScreen = [innerWidth / 2, innerHeight / 2]
		let target = vec2.sub(midScreen, midScreen, [hpos[0] * 16, hpos[1] * 16])
		let distance = vec2.distance(cur, target)

		// if we're close enough or too far we snap
		if (distance > 200 || distance < delta) {
			this.stage.position.set(...target)
		} else {
			// smooth camera
			let direction = vec2.sub(target, target, cur)
			vec2.normalize(direction, direction)
			vec2.scaleAndAdd(cur, cur, direction, delta)
			this.stage.position.set(...cur)
		}
	}
}
