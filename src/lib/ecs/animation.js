import { blocks, modifiers } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i } from "../tools"
import _order from "./order.json"
import { addModifier, removeModifier } from "./sprite"

/**
 * Contains an Array of definitions of shape
 * [[<sprite>, <nbFrames>], ...]
 * Creates a sprite component if not found
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {any[][]} params.frames
 * @param {Boolean} [params.flipV]
 * @param {Boolean} [params.flipH]
 */
export function animation(e, { frames, flipV = false, flipH = false } = {}) {
	if (!frames && frames.length) throw new Error("Empty animation supplied")

	return {
		frames,
		get flipH() {
			return flipH
		},
		set flipH(val) {
			flipH = !!val
			if (flipH) addModifier(e, modifiers.flipH)
			else removeModifier(e, modifiers.flipH)
		},
		get flipV() {
			return flipV
		},
		set flipV(val) {
			flipV = !!val
			if (flipV) addModifier(e, modifiers.flipV)
			else removeModifier(e, modifiers.flipV)
		},
		time: 1,
		current: 0,
		mount() {
			if (!e.sprite) e.add("sprite")
			e.sprite.type = frames[0][0]
			e.animation.flipH = flipH
			e.animation.flipV = flipV
		},
	}
}

export function update(game) {
	findByComponent("animation").forEach(ent => {
		if (!ent.sprite) return

		let animation = ent.animation
		let { time, current, frames, flipH, flipV } = animation

		// if we reached the max duration of the current frame
		if (++animation.time > frames[current][1]) {
			// reset and go to next frame, wrap if necessary
			animation.time = 1
			animation.current = ++current % frames.length
			ent.sprite.type = frames[animation.current][0]
		}
	})
}

export { animation as component }
export const name = "animation"
export const order = _order[name]
