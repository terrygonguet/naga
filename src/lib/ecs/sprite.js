import { blocks } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

/**
 * A sprite, can be either background of foreground
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {String} params.type
 * @param {Boolean} [params.isBackground]
 */
export function sprite(e, { type, isBackground = false }) {
	return { type, isBackground, isForeground: !isBackground }
}

export function update(game) {
	// clear fg & bg before re-drawing
	game.background = Array(game.background.length).fill(blocks.empty)
	game.foreground = Array(game.background.length).fill(null)
	let xy2i = make_xy2i(game.width)

	findByComponent("sprite").forEach(ent => {
		if (!ent.position) return
		let { x, y } = ent.position
		;(ent.sprite.isBackground ? game.background : game.foreground)[xy2i(x, y)] =
			ent.sprite.type // lol
	})
}

export { sprite as component }
export const name = "sprite"
export const order = _order[name]
