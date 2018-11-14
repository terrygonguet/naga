import _uniq from "lodash/uniq"
import { blocks } from "./blocks"
import { make_xy2i, make_i2xy } from "./tools"

/**
 * Creates a dungeon and returns it as a linear Array
 * @param {Object} params
 * @param {Number} params.nbRoomH
 * @param {Number} params.nbRoomW
 * @param {Number} params.roomWidth
 * @param {Number} params.roomHeight
 * @param {Function} params.rng
 * @returns {String[]}
 */
export function createDungeon({
	nbRoomW,
	nbRoomH,
	roomWidth,
	roomHeight,
	rng,
}) {
	let width = nbRoomW * (roomWidth - 1) + 1
	let height = nbRoomH * (roomHeight - 1) + 1
	let grid = Array(width * height).fill(blocks.ground)
	let xy2iGrid = make_xy2i(width),
		i2xyGrid = make_i2xy(width),
		xy2iRooms = make_xy2i(nbRoomW),
		i2xyRooms = make_i2xy(nbRoomW)
	// actual room width/height with starter wall
	let rw = roomWidth - 1,
		rh = roomHeight - 1

	grid.width = width
	grid.height = height

	// init room graph
	let rooms = Array(nbRoomW * nbRoomH)
		.fill(0)
		.map((r, i) => ({ right: false, down: false, index: i }))

	let indexes = []
	do {
		// find two adjacent rooms and make a door
		// between if they aren't connected already
		let x1 = Math.floor(rng() * nbRoomW),
			y1 = Math.floor(rng() * nbRoomH)
		let room1 = rooms[xy2iRooms(x1, y1)]
		let x2 = x1,
			y2 = y1
		// add +/-1 to either x2 or y2
		rng() < 0.5
			? (x2 += (-1) ** Math.round(rng()))
			: (y2 += (-1) ** Math.round(rng()))
		if (x2 < 0 || y2 < 0 || x2 >= nbRoomW || y2 >= nbRoomH) continue
		let room2 = rooms[xy2iRooms(x2, y2)]
		if (room1.index === room2.index) continue

		// connect the two rooms
		if (x1 < x2) room1.right = true
		else if (x1 > x2) room2.right = true
		else if (y1 < y2) room1.down = true
		else if (y1 > y2) room2.down = true
		let minIndex = Math.min(room1.index, room2.index)
		let maxIndex = Math.max(room1.index, room2.index)
		rooms.forEach(r => r.index === maxIndex && (r.index = minIndex))

		indexes = rooms.map(r => r.index)
	} while (_uniq(indexes).length !== 1)

	// throw in some more doors
	for (let i = 0; i < 2 * Math.max(nbRoomW, nbRoomH); i++) {
		let x1 = Math.floor(rng() * nbRoomW),
			y1 = Math.floor(rng() * nbRoomH)
		let room1 = rooms[xy2iRooms(x1, y1)]
		let x2 = x1,
			y2 = y1
		// add +/-1 to either x2 or y2
		rng() < 0.5
			? (x2 += (-1) ** Math.round(rng()))
			: (y2 += (-1) ** Math.round(rng()))
		if (x2 < 0 || y2 < 0 || x2 >= nbRoomW || y2 >= nbRoomH) {
			i--
			continue
		}
		let room2 = rooms[xy2iRooms(x2, y2)]
		// connect the two rooms
		if (x1 < x2) room1.right = true
		else if (x1 > x2) room2.right = true
		else if (y1 < y2) room1.down = true
		else if (y1 > y2) room2.down = true
	}

	// place rooms and their doors
	for (let i = 0; i < nbRoomW * nbRoomH; i++) {
		let { x, y } = i2xyRooms(i)
		let room = rooms[i]

		// right wall
		for (let h = 0; h < roomHeight; h++) {
			grid[xy2iGrid((x + 1) * rw, y * rh + h)] = blocks.wall
		}
		// down wall
		for (let w = 0; w < roomWidth; w++) {
			grid[xy2iGrid(x * rw + w, (y + 1) * rh)] = blocks.wall
		}

		// doors
		// 50% chance that we put a door un the wall
		// else we remove the wall (except the extremities)
		let hasDoor = rng() < 0.5
		if (room.right) {
			if (hasDoor) {
				grid[xy2iGrid((x + 1) * rw, y * rh + Math.floor(rh / 2))] = blocks.door
				grid[xy2iGrid((x + 1) * rw, y * rh + Math.ceil(rh / 2))] = blocks.door
			} else {
				for (let h = 1; h < roomHeight - 1; h++) {
					grid[xy2iGrid((x + 1) * rw, y * rh + h)] = blocks.ground
				}
			}
		}
		if (room.down) {
			if (hasDoor) {
				grid[xy2iGrid(x * rw + Math.floor(rw / 2), (y + 1) * rh)] = blocks.door
				grid[xy2iGrid(x * rw + Math.ceil(rw / 2), (y + 1) * rh)] = blocks.door
			} else {
				for (let w = 1; w < roomWidth - 1; w++) {
					grid[xy2iGrid(x * rw + w, (y + 1) * rh)] = blocks.ground
				}
			}
		}
	}

	// outer walls
	for (let x = 0; x < width; x++)
		grid[x] = grid[xy2iGrid(x, height - 1)] = blocks.wall
	for (let y = 0; y < height; y++)
		grid[y * width] = grid[xy2iGrid(width - 1, y)] = blocks.wall

	// TODO : remove orphan blocks and other uglies

	// Add shadow on walls that have ground space below them
	for (let i = 0; i < width * height; i++) {
		if (grid[i] !== blocks.wall) continue
		let { x, y } = i2xyGrid(i)
		let below = grid[xy2iGrid(x, y + 1)]
		if (!below || below === blocks.ground) grid[i] = blocks.walls.top
	}

	// corners
	grid[0] = blocks.walls.topLeft
	grid[width - 1] = blocks.walls.topRight
	grid[xy2iGrid(0, height - 1)] = blocks.walls.btmLeft
	grid[grid.length - 1] = blocks.walls.btmRight

	return grid
}
