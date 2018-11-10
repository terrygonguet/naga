import { blocks } from "../blocks"
import { findByComponent } from "geotic"

export function position(e, { x, y, type }) {
	return { x, y, type }
}

export function update(game) {
	game.grid = game.grid.map(() => blocks.empty)
	findByComponent("position").forEach(ent => {
		game.cell(ent.position)
	})
}

export { position as component }
export const name = "position"
