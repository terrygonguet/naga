import _order from "./order.json"
import { Sprite } from "pixi.js"
import { entity, findByTag } from "geotic"
import { doorAndWalls, walls } from "../blocks.js"

/**
 * A container for template data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 */
export function background(e, { sprites } = {}) {
	let game = findByTag("game")[0].tags.game
	sprites.forEach((c, i) => {
		let s = new Sprite(game.sheet.textures[c])
		let pos = [i % game.width, Math.floor(i / game.width)]
		s.position.set(pos[0] * s.width, pos[1] * s.height)
		game.layers.background.addChild(s)

		if (doorAndWalls.includes(c)) {
			entity()
				.add("position", pos)
				.add("hitbox", {
					blocksSight: doorAndWalls.includes(c),
					blocksMoving: walls.includes(c),
				})
		}
	})
	return {}
}

export function update(game) {}

export { background as component }
export const name = "background"
export const order = _order[name]
