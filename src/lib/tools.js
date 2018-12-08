import { findByComponent } from "geotic"
import { dirname } from "path"
import { vec2 } from "gl-matrix"
import line from "bresenham-line"

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
 * @param {Object} dimensions
 * @param {Number} dimensions.width The width of the grid
 * @param {Number} dimensions.height The height of the grid
 * @returns {Function}
 */
export function make_isInBounds({ width, height }) {
	return function(x, y) {
		return x >= 0 && y >= 0 && x < width && y < height
	}
}

/**
 * Makes a function that compares a position with the first position
 * @param {Array} pt1
 * @returns {Function}
 */
export function make_cmpPos(pt1) {
	return function(pt2) {
		return vec2.equals(pt1, pt2)
	}
}

/**
 * Used to filter an array of entities by position
 * @param {Object} pos
 */
export function byPosition(pos) {
	return function(entity) {
		return entity.position && vec2.equals(pos, entity.position)
	}
}

/**
 * Returns an array of entites with the component and that will tick this update
 * @param {String} component The name of the component
 */
export function findByCanTick(component) {
	return findByComponent(component).filter(c => c?.speed.canTick || !c.speed)
}

/**
 * Checks if the two points have a line of sight between them
 * @param {vec2|Number[]} from
 * @param {vec2|Number[]} to
 */
export function canSee(from, to) {
	let canSee = true
	for (const point of line(vectToxy(from), vectToxy(to))) {
		let { x, y } = point
		canSee = !findByComponent("position")
			.filter(byPosition([x, y]))
			.some(e => e?.hitbox?.blocksSight)
		if (!canSee) break
	}
	return canSee
}

/**
 * Converts vector pos to xy object
 * @param {vec2|Number[]} vect vec2 or array
 */
function vectToxy(vect) {
	let [x, y] = vect
	return { x, y }
}
