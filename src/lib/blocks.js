export const blocks = {
	wall: "wall",
	walls: {
		top: "wall-top",
		topLeft: "wall-top-left",
		topRight: "wall-top-right",
		btmLeft: "wall-bottom-left",
		btmRight: "wall-bottom-right",
	},

	empty: "empty",
	shadow: "shadow",
	unknown: "unknown",
	door: "door",

	snake: "snake",
	snakeHead: {
		up: "snake-head-up",
		down: "snake-head-down",
		left: "snake-head-left",
		right: "snake-head-right",
	},
	enemy: {
		red: "enemy-red-1",
		redLow: "enemy-red-2",
		green: "enemy-green-1",
		greenLow: "enemy-green-2",
	},
}

export const modifiers = {
	flipV: "flipV",
	flipH: "flipH",
	highlight: "highlight",
}

export const walls = [
	blocks.wall,
	blocks.walls.top,
	blocks.walls.topLeft,
	blocks.walls.topRight,
	blocks.walls.btmLeft,
	blocks.walls.btmRight,
]

export const snake = [
	blocks.snake,
	blocks.snakeHead.down,
	blocks.snakeHead.left,
	blocks.snakeHead.right,
	blocks.snakeHead.up,
]

export const doorAndWalls = [...walls, blocks.door]

export const animations = {
	enemyRed: [[blocks.enemy.red, 2], [blocks.enemy.redLow, 2]],
	enemyGreen: [[blocks.enemy.greenLow, 2], [blocks.enemy.green, 2]],
}
