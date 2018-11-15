import { findByComponent } from "geotic"

/**
 * Makes a function that translates x y pos to linear array index
 * @param {Number} width The width of the grid
 * @returns {Function}
 */
export function make_xy2i(width) {
	return function(x, y) {
		if (x < 0 || y < 0) return -1
		return x + y * width
	}
}

/**
 * Makes a function that translates linear array index to x y pos
 * @param {Number} width The width of the grid
 * @returns {Function}
 */
export function make_i2xy(width) {
	return function(i) {
		return { x: i % width, y: Math.floor(i / width) }
	}
}

/**
 * Makes a function that checks if the given x y is in bounds
 * @param {Object} params
 * @param {Number} params.width The width of the grid
 * @param {Number} params.height The height of the grid
 * @returns {Function}
 */
export function make_isInBounds({ width, height }) {
	return function(x, y) {
		return x >= 0 && y >= 0 && x < width && y < height
	}
}

/**
 * Makes a function that compares a position with the first position
 * @param {Object} params
 * @param {Number} params.x1
 * @param {Number} params.y1
 * @returns {Function}
 */
export function make_cmpPos({ x: x1, y: y1 }) {
	return function({ x: x2, y: y2 }) {
		return x1 === x2 && y1 === y2
	}
}

/**
 * Makes a function that returns the distance of the second point with the first
 * @param {Object} params
 * @param {Number} params.x1
 * @param {Number} params.y1
 * @returns {Function}
 */
export function make_distanceTo({ x: x1, y: y1 }) {
	return function({ x: x2, y: y2 }) {
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
	}
}

/**
 * Returns an array of entites with the component and that will tick this update
 * @param {String} component The name of the component
 */
export function findByCanTick(component) {
	return findByComponent(component).filter(c => c?.speed.canTick || !c.speed)
}
