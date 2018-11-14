import { blocks } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

/**
 * A sprite, can be either background of foreground.
 * Modifiers can be applied to any sprite
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {String} params.type
 * @param {Boolean} [params.isBackground]
 * @param {String[]} [params.modifiers]
 */
export function sprite(e, { type, isBackground = false, modifiers = [] } = {}) {
	return { type, isBackground, modifiers }
}

export function update(game) {
	// clear fg & bg before re-drawing
	game.background = Array(game.background.length).fill(blocks.ground)
	game.foreground = Array(game.background.length).fill(null)
	let xy2i = make_xy2i(game.width)

	findByComponent("sprite").forEach(ent => {
		if (!ent.position) return
		let { x, y } = ent.position
		;(ent.sprite.isBackground ? game.background : game.foreground)[
			xy2i(x, y)
		] = (ent.sprite.type + " " + ent.sprite.modifiers.join(" ")).trim() // lol
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
	if (modifiers.indexOf(modifier) !== -1) return
	modifiers.push(modifier)
}

/**
 * Removes a modifier of the sprite component of the entity if present
 * @param {Entity} ent
 * @param {String} modifier
 */
export function removeModifier(ent, modifier) {
	if (!ent.sprite) return
	let modifiers = ent.sprite.modifiers
	let i = modifiers.indexOf(modifier)
	if (i === -1) return
	modifiers.splice(i, 1)
}

export { sprite as component }
export const name = "sprite"
export const order = _order[name]
