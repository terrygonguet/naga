import { blocks } from "../blocks"
import { findByComponent, findByTag } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"
import { Sprite, filters } from "pixi.js"
import { Vector } from "sylvester-es6/target/Vector"

/**
 * A sprite, can be either background of foreground.
 * Modifiers can be applied to any sprite
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {String} params.texture
 * @param {String} [params.layer]
 * @param {String[]} [params.modifiers]
 */
export function sprite(
	e,
	{ texture, layer = "entities", modifiers = [] } = {}
) {
	let pos = e.position
	let game = findByTag("game")[0].tags.game
	let s = makeSprite(game.sheet.textures[texture])
	s.position.set(...pos.x(s.width).elements)
	modifiers.forEach(m => modifiersAdd[m]?.(s))

	return {
		get texture() {
			return s
		},
		set texture(val) {
			s.texture = game.sheet.textures[val]
		},
		layer,
		modifiers,
		mount() {
			game.layers[layer].addChild(s)
		},
		unmount() {
			game.layers[layer].removeChild(s)
		},
	}
}

export function update(game) {
	findByComponent("sprite").forEach(ent => {
		if (!ent.position) return
		let pos = ent.position
		let pixiSprite = ent.sprite.texture
		let oldPos = new Vector([pixiSprite.x, pixiSprite.y])
		if (!pos.eql(oldPos))
			pixiSprite.position.set(...pos.x(pixiSprite.width).elements)
	})
}

/**
 * Adds a modifier to the sprite component of the entity
 * if it's not already there
 * @param {Entity} ent
 * @param {String} modifier
 */
export function addModifier(ent, modifier) {
	if (!ent.sprite) return
	let modifiers = ent.sprite.modifiers
	if (modifiers.indexOf(modifier) !== -1) return ent
	modifiers.push(modifier)
	modifiersAdd[modifier]?.(ent.sprite.texture)
	return ent
}

/**
 * Removes a modifier of the sprite component of the entity if present
 * @param {Entity} ent
 * @param {String} modifier
 */
export function removeModifier(ent, modifier) {
	if (!ent.sprite) return ent
	let modifiers = ent.sprite.modifiers
	let i = modifiers.indexOf(modifier)
	if (i === -1) return ent
	modifiers.splice(i, 1)
	modifiersRemove[modifier]?.(ent.sprite.texture)
	return ent
}

/**
 * Makes a sprite
 * @param {Texture} texture
 */
function makeSprite(texture) {
	let s = new Sprite(texture)
	s.pivot.set(s.width / 2, s.height / 2)
	return s
}

let brightenFilter = new filters.ColorMatrixFilter()
brightenFilter.brightness(1.5)

const modifiersAdd = {
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
		sprite.filters = (sprite.filters || []).concat([brightenFilter])
		return sprite
	},
}

const modifiersRemove = {
	up(sprite) {
		sprite.rotation = 0
		return sprite
	},
	down(sprite) {
		sprite.rotation = 0
		return sprite
	},
	left(sprite) {
		sprite.rotation = 0
		return sprite
	},
	flipV(sprite) {
		sprite.scale.x = 1
		return sprite
	},
	flipH(sprite) {
		sprite.scale.y = 1
		return sprite
	},
	highlight(sprite) {
		sprite.filters = (sprite.filters || []).filter(f => f !== brightenFilter)
		return sprite
	},
}

export { sprite as component }
export const name = "sprite"
export const order = _order[name]
