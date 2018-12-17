/**
 * "enum" of all the sprite keys
 */
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
	key: "key",

	snake: "snake",
	snakeHead: "snake-head",
	boss: "boss-snake",
	bossHead: "boss-snake-head",
	enemy: {
		red: "red-1",
		redLow: "red-2",
		green: "green-1",
		greenLow: "green-2",
		female: "female-1",
		femaleLow: "female-2",
		male: "male-1",
		maleLow: "male-2",
		bear: "bear-1",
		bearLow: "bear-2",
		knight: "knight-1",
		knightLow: "knight-2",
	},

	magic: {
		s1: "sprite57",
		s2: "sprite58",
		s3: "sprite59",
		s4: "sprite60",
		s5: "sprite61",
		s6: "sprite62",
		s7: "sprite63",
		s8: "sprite64",
	},

	portal: "portal",
	portalOpen: "portal-open",
}

/**
 * "enum" of all the modifier names
 */
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

/**
 * All the sprites to consider wall
 */
export const walls = [
	blocks.wall,
	blocks.walls.top,
	blocks.walls.topLeft,
	blocks.walls.topRight,
	blocks.walls.btmLeft,
	blocks.walls.btmRight,
	blocks.column,
]

/**
 * All the sprites to consider snake
 */
export const snake = [blocks.snake, blocks.snakeHead]

/**
 * All the sprites to consider walls including doors
 */
export const doorAndWalls = [...walls, blocks.door]

/**
 * "enum" of all the animations, in the format:
 * [[sprite, nbTicks], ...]
 */
export const animations = {
	enemyRed: [[blocks.enemy.red, 8], [blocks.enemy.redLow, 8]],
	enemyGreen: [[blocks.enemy.green, 8], [blocks.enemy.greenLow, 8]],
	female: [[blocks.enemy.female, 9], [blocks.enemy.femaleLow, 7]],
	male: [[blocks.enemy.male, 9], [blocks.enemy.maleLow, 7]],
	bear: [[blocks.enemy.bear, 9], [blocks.enemy.bearLow, 7]],
	knight: [[blocks.enemy.knight, 9], [blocks.enemy.knightLow, 7]],
	magic: [
		[blocks.magic.s1, 2],
		[blocks.magic.s2, 2],
		[blocks.magic.s3, 2],
		[blocks.magic.s4, 2],
		[blocks.magic.s5, 2],
		[blocks.magic.s6, 2],
		[blocks.magic.s7, 2],
		[blocks.magic.s8, 2],
	],
}
