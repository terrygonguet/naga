import {
	Application,
	Texture,
	Spritesheet,
	Sprite,
	filters,
	Point,
	settings,
	SCALE_MODES,
} from "pixi.js"
import spritesData from "../assets/micro_dungeon_tileset.json"
import spritesImage from "../assets/micro_dungeon_tileset.png"
import { make_i2xy, make_xy2i } from "./tools"
import { blocks, snake } from "./blocks"
import { Vector } from "sylvester-es6/target/Vector"

spritesData.meta.image = spritesImage
settings.SCALE_MODE = SCALE_MODES.NEAREST
settings.RESOLUTION = window.devicePixelRatio

export default class Renderer {
	width = 0
	height = 0
	spriteWidth = 0
	spriteHeight = 0
	currentPosition = new Vector([0, 0])
	app = null
	stage = null
	sheet = null
	background = []
	foreground = []
	sprites = []
	dirty = true

	constructor({ el }) {
		el = typeof el === "string" ? document.querySelector(el) : el
		this.app = new Application({
			view: el,
			antialias: true,
			width: innerWidth,
			height: innerHeight,
			autoStart: false,
		})

		this.app.ticker.add(this.update.bind(this))

		let texture = Texture.fromImage(spritesImage)
		this.sheet = new Spritesheet(texture.baseTexture, spritesData, spritesImage)
		this.stage = this.app.stage

		this.sheet.parse(() => {
			this.app.start()
		})

		console.log(this)
	}

	setLayers({ background, foreground, width, height }) {
		this.background = background
		this.foreground = foreground
		this.width = width
		this.height = height
		this.dirty = true

		if (this.sprites.length !== width * height * 2) {
			// TODO : optimize
			this.sprites.forEach(s => this.stage.removeChild(s))
			this.sprites = Array(width * height * 2)
				.fill(0)
				.map(() => new Sprite(this.sheet.textures.ground))

			this.spriteWidth = this.sprites[0].width
			this.spriteHeight = this.sprites[0].height

			let i2xy = make_i2xy(width)
			this.sprites.forEach((s, i) => {
				let { x, y } = i2xy(i)
				y = y >= height ? y - height : y
				s.position.set(x * s.width, y * s.height)
				s.pivot.set(s.width / 2, s.height / 2)
				this.stage.addChild(s)
			})

			this.currentPosition = new Vector([
				Math.round(innerWidth / 2 - this.stage.width / 2),
				Math.round(innerHeight / 2 - this.stage.height / 2),
			])
			this.stage.setTransform(...this.currentPosition.elements)
		}
	}

	update(delta) {
		// camera movement
		let snakeIndex = this.foreground.findIndex(c =>
			c?.startsWith(blocks.snakeHead)
		)
		if (snakeIndex !== -1) {
			let { x, y } = make_i2xy(this.width)(snakeIndex)
			let target = new Vector([
				innerWidth / 2 - (x + 0.5) * this.spriteWidth,
				innerHeight / 2 - (y + 0.5) * this.spriteHeight,
			])
			let cur = this.currentPosition
			let distance = target.distanceFrom(cur)
			let speed = 1 // in px/frame ? Not sure

			// if too close or too far
			if (distance > 300 * speed * delta || distance < speed * delta) {
				this.currentPosition = target.round()
				this.stage.setTransform(...target.round().elements)
			} else {
				let direction = target.subtract(cur).toUnitVector()
				this.currentPosition = cur.add(direction.x(speed * delta)).round()
				this.stage.setTransform(...this.currentPosition.elements)
			}
		}

		if (!this.dirty) return
		// this.stage.cacheAsBitmap = false
		let cells = this.background.concat(this.foreground)
		let length = cells.length
		for (let i = 0; i < length; i++) {
			let cell = cells[i]
			let [block, ...mods] = cell ? cell.split(" ") : []
			let sprite = this.sprites[i]
			sprite.texture = this.sheet.textures[block]

			clearModifiers(sprite)
			for (const mod of mods) modifiers[mod]?.(sprite)
		}
		this.dirty = false
		// this.stage.cacheAsBitmap = true
	}
}

function clearModifiers(sprite) {
	sprite.rotation = 0
	sprite.alpha = 1
	sprite.scale.set(1, 1)
	sprite.filters = null
	return sprite
}

let brightenFilter = new filters.ColorMatrixFilter()
brightenFilter.brightness(1.5)

const modifiers = {
	transparent(sprite) {
		sprite.alpha = 0.5
		return sprite
	},
	up(sprite) {
		sprite.rotation = -Math.PI / 2
		return sprite
	},
	down(sprite) {
		sprite.rotation = Math.PI / 2
		return sprite
	},
	left(sprite) {
		sprite.rotation = Math.PI
		return sprite
	},
	flipV(sprite) {
		sprite.scale.x = -1
		return sprite
	},
	flipH(sprite) {
		sprite.scale.y = -1
		return sprite
	},
	highlight(sprite) {
		sprite.filters = [brightenFilter]
		return sprite
	},
}
