// @flow
export type Block = string | null

export const blocks: { [key: string]: Block } = {
	wall: "wall",
	wallTop: "wall-top",
	wallTopLeft: "wall-top-left",
	wallTopRight: "wall-top-right",
	wallBtmLeft: "wall-bottom-left",
	wallBtmRight: "wall-bottom-right",
	column: "column",

	ground: "ground",
	darkness: "darkness",
	door: "door",

	snake: "snake",
	snakeHead: "snake-head",
	enemyRed: "red-1",
	enemyRedLow: "red-2",
	enemyGreen: "green-1",
	enemyGreenLow: "green-2",
}

export type Modifier = string

export const modifiers: { [key: string]: Modifier } = {
	flipV: "flipV",
	flipH: "flipH",
	highlight: "highlight",
	up: "up",
	down: "down",
	left: "left",
	right: "right",
	transparent: "transparent",
}

export const walls: Array<Block> = [
	blocks.wall,
	blocks.wallTop,
	blocks.wallTopLeft,
	blocks.wallTopRight,
	blocks.wallBtmLeft,
	blocks.wallBtmRight,
	blocks.column,
]

export const snake: Array<Block> = [blocks.snake, blocks.snakeHead]

export const doorAndWalls: Array<Block> = [...walls, blocks.door]

export const animations: { [key: string]: Array<[Block, number]> } = {
	enemyRed: [[blocks.Red, 8], [blocks.RedLow, 8]],
	enemyGreen: [[blocks.GreenLow, 8], [blocks.Green, 8]],
}
