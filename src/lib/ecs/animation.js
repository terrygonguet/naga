import { blocks } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"

/**
 * Contains an Array of definitions of shape
 * [[<sprite>, <nbFrames>], ...]
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Array} params.frames
 * @param {Boolean} [params.flipV]
 * @param {Boolean} [params.flipH]
 */
export function animation(e, { frames, flipV = false, flipH = false }) {
	if (!frames && frames.length) throw new Error("Empty animation supplied")
	e.sprite && (e.sprite.type = frames[0][0])
	return {
		frames,
		flipH,
		flipV,
		frameIndex: 1,
		current: 0,
	}
}

export function update(game) {
	findByComponent("animation").forEach(ent => {
		if (!ent.sprite) return
		let animation = ent.animation
		let { frameIndex, current, frames, flipH, flipV } = animation
		if (++animation.frameIndex > frames[current][1]) {
			animation.frameIndex = 1
			animation.current = ++current % frames.length
			ent.sprite.type =
				frames[animation.current][0] +
				(flipH ? " flipH" : "") +
				(flipV ? " flipV" : "")
		}
	})
}

export { animation as component }
export const name = "animation"
export const order = _order[name]
