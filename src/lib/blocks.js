export const blocks = {
	wall: "wall",
	walls: {
		top: "wall-top",
		topLeft: "wall-top-left",
		topRight: "wall-top-right",
		btmLeft: "wall-bottom-left",
		btmRight: "wall-bottom-right",
	},
	column: "column",

	ground: "ground",
	darkness: "darkness",
	door: "door",

	snake: "snake",
	snakeHead: "snake-head",
	enemy: {
		red: "red-1",
		redLow: "red-2",
		green: "green-1",
		greenLow: "green-2",
		female: "female-1",
		femaleLow: "female-2",
	},
}

export const modifiers = {
	flipV: "flipV",
	flipH: "flipH",
	highlight: "highlight",
	up: "up",
	down: "down",
	left: "left",
	right: "right",
	transparent: "transparent",
}

export const walls = [
	blocks.wall,
	blocks.walls.top,
	blocks.walls.topLeft,
	blocks.walls.topRight,
	blocks.walls.btmLeft,
	blocks.walls.btmRight,
	blocks.column,
]

export const snake = [blocks.snake, blocks.snakeHead]

export const doorAndWalls = [...walls, blocks.door]

export const animations = {
	enemyRed: [[blocks.enemy.red, 8], [blocks.enemy.redLow, 8]],
	enemyGreen: [[blocks.enemy.green, 8], [blocks.enemy.greenLow, 8]],
	female: [[blocks.enemy.female, 9], [blocks.enemy.femaleLow, 7]],
}
