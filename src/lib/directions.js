import { findKey as _findKey } from "lodash"
import { Vector } from "sylvester-es6/target/Vector"

/**
 * The key codes associated with the 4 directions
 */
export let directions = {
	up: "ArrowUp",
	left: "ArrowLeft",
	down: "ArrowDown",
	right: "ArrowRight",
}

// black magic
/**
 * The direction vectors for each of the key codes
 * e.g.: vectors[directions.up] == Vector([0, -1])
 */
export const vectors = new Proxy(
	{
		up: new Vector([0, -1]),
		left: new Vector([-1, 0]),
		down: new Vector([0, 1]),
		right: new Vector([1, 0]),
	},
	{
		get(t, prop) {
			return t[_findKey(directions, key => key === prop)]
		},
	}
)

/**
 * Changes the mapped direction key codes
 * @param {Object} params
 * @param {String} params.up
 * @param {String} params.down
 * @param {String} params.left
 * @param {String} params.right
 */
export function setDirections({ up, down, left, right }) {
	directions = { up, down, left, right }
}

/**
 * Returns the opposite of the given direction
 * @param {String} direction
 * @returns {String}
 */
export function reverse(direction) {
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
 * @param {String} direction
 * @returns {String}
 */
export function turnRight(direction) {
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
 * @param {String} direction
 * @returns {String}
 */
export function turnLeft(direction) {
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
