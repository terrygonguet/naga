import { blocks, walls } from "../blocks"
import { findByComponent } from "geotic"
import { make_xy2i, make_isInBounds, make_cmpPos } from "../tools"

export function fov(e) {
	return "fov"
}

let fogOfWar = null
let doorAndWalls = [...walls, blocks.door]

function initFogOfWar(grid) {
	// fogOfWar = grid.map(c => !doorAndWalls.includes(c))
	fogOfWar = Array(grid.length).fill(true)
}

export function update(game) {
	if (!fogOfWar) initFogOfWar(game.grid)

	let xy2i = make_xy2i(game.width)
	let isInBounds = make_isInBounds(game)
	let entities = findByComponent("position")
	game.grid.forEach((c, i) => (game.grid[i] = fogOfWar[i] ? blocks.hidden : c))
	findByComponent("fov").forEach(ent => {
		let { x, y } = ent.position
		let queue = [
			{ x: x + 1, y },
			{ x, y: y + 1 },
			{ x: x - 1, y },
			{ x, y: y - 1 },
			{ x: x + 1, y: y + 1 },
			{ x: x + 1, y: y - 1 },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y - 1 },
		]
		while (queue.length) {
			let { x, y } = queue.shift()
			let cmpPos = make_cmpPos({ x, y })
			if (!fogOfWar[xy2i(x, y)]) continue
			else if (isInBounds(x, y)) {
				fogOfWar[xy2i(x, y)] = false
				let cell = entities.find(e => cmpPos(e.position))?.position.type
				if (!doorAndWalls.includes(cell))
					queue.push(
						{ x: x + 1, y },
						{ x, y: y + 1 },
						{ x: x - 1, y },
						{ x, y: y - 1 },
						{ x: x + 1, y: y + 1 },
						{ x: x + 1, y: y - 1 },
						{ x: x - 1, y: y + 1 },
						{ x: x - 1, y: y - 1 }
					)
			}
		}
	})
}

export { fov as component }
export const name = "fov"
