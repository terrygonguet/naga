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
	hidden: "shadow",
	door: "door",

	snake: "snake",
	snakeHead: {
		up: "snake-head-up",
		down: "snake-head-down",
		left: "snake-head-left",
		right: "snake-head-right",
	},
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
