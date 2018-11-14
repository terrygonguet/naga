import { Application, Texture, Spritesheet, Sprite } from "pixi.js"
import spritesData from "../assets/micro_dungeon_tileset.json"
import spritesImage from "../assets/micro_dungeon_tileset.png"
import { make_i2xy, make_xy2i } from "./tools"

spritesData.meta.image = spritesImage

export default class Renderer {
	width = 0
	height = 0
	app = null
	stage = null
	sheet = null
	background = []
	foreground = []
	sprites = []

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

		if (this.sprites.length !== width * height * 2) {
			// TODO : optimize
			this.sprites.forEach(s => this.stage.removeChild(s))
			this.sprites = Array(width * height * 2)
				.fill(0)
				.map(() => new Sprite(this.sheet.textures.ground))

			let i2xy = make_i2xy(width)
			this.sprites.forEach((s, i) => {
				let { x, y } = i2xy(i)
				y = y >= height ? y - height : y
				s.position.set(x * s.width, y * s.height)
				s.pivot.set(s.width / 2, s.height / 2)
				this.stage.addChild(s)
			})

			this.stage.setTransform(
				innerWidth / 2 - this.stage.width / 2,
				innerHeight / 2 - this.stage.height / 2
			)
		}
	}

	update(delta) {
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
	}
}

function clearModifiers(sprite) {
	sprite.rotation = 0
	sprite.alpha = 1
	sprite.scale.set(1, 1)
	return sprite
}

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
}
