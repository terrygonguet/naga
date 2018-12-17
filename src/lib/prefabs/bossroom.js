import { blocks } from "../blocks"
import { make_i2xy, make_xy2i } from "../tools"

export function make() {
	let w = 30,
		h = 30
	let bossRoom = Array(w * h).fill(blocks.ground)
	let i2xy = make_i2xy(w)
	let xy2i = make_xy2i(w)
	bossRoom = bossRoom.map((c, i) => {
		let { x, y } = i2xy(i)
		if (x == 0 || y == 0 || x == w - 1 || y == h - 1) return blocks.wall
		else return c
	})

	// Add shadow on walls that have ground space below them
	for (let i = 0; i < w * h; i++) {
		if (bossRoom[i] !== blocks.wall) continue
		let { x, y } = i2xy(i)
		let below = bossRoom[xy2i(x, y + 1)]
		if (!below || below === blocks.ground) bossRoom[i] = blocks.walls.top
	}

	// corners
	bossRoom[0] = blocks.walls.topLeft
	bossRoom[w - 1] = blocks.walls.topRight
	bossRoom[xy2i(0, h - 1)] = blocks.walls.btmLeft
	bossRoom[bossRoom.length - 1] = blocks.walls.btmRight

	bossRoom.width = w
	bossRoom.height = h
	return bossRoom
}
