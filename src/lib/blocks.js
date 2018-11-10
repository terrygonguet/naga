export const blocks = {
	wall: "wall",
	wallTop: "wall-top",

	empty: "empty",

	snake: "snake",
	snakeHead: {
		up: "snake-head-up",
		down: "snake-head-down",
		left: "snake-head-left",
		right: "snake-head-right",
	},
}

export const walls = [blocks.wall, blocks.wallTop]

export const snake = [
	blocks.snake,
	blocks.snakeHead.down,
	blocks.snakeHead.left,
	blocks.snakeHead.right,
	blocks.snakeHead.up,
]
