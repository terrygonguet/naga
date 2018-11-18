// @flow
export type Direction = string
export type Directions = {
	up: Direction,
	down: Direction,
	left: Direction,
	right: Direction,
}

/**
 * The key codes associated with the 4 directions
 */
export let directions: Directions = {
	up: "ArrowUp",
	left: "ArrowLeft",
	down: "ArrowDown",
	right: "ArrowRight",
}

/**
 * Changes the mapped direction key codes
 */
export function setDirections({
	up,
	down,
	left,
	right,
}: {
	up: Direction,
	down: Direction,
	left: Direction,
	right: Direction,
}) {
	directions = { up, down, left, right }
}

/**
 * Returns the opposite of the given direction
 */
export function reverse(direction: Direction): ?Direction {
	switch (direction) {
		case directions.up:
			return directions.down
		case directions.down:
			return directions.up
		case directions.left:
			return directions.right
		case directions.right:
			return directions.left
		default:
			return null
	}
}

/**
 * Returns the direction rotated right
 */
export function turnRight(direction: Direction): ?Direction {
	switch (direction) {
		case directions.up:
			return directions.right
		case directions.down:
			return directions.left
		case directions.left:
			return directions.up
		case directions.right:
			return directions.down
		default:
			return null
	}
}

/**
 * Returns the direction rotated left
 */
export function turnLeft(direction: Direction): ?Direction {
	switch (direction) {
		case directions.up:
			return directions.left
		case directions.down:
			return directions.right
		case directions.left:
			return directions.down
		case directions.right:
			return directions.up
		default:
			return null
	}
}
