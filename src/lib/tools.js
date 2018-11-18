// @flow
import { findByComponent } from "./geotic"
import { dirname } from "path"

/**
 * Makes a function that translates x y pos to linear array index
 */
export function make_xy2i(width: number): (x: number, y: number) => number {
	return function(x: number, y: number): number {
		if (x < 0 || y < 0) return -1
		return x + y * width
	}
}

/**
 * Makes a function that translates linear array index to x y pos
 */
export function make_i2xy(width: number) {
	return function(i: number) {
		return { x: i % width, y: Math.floor(i / width) }
	}
}

/**
 * Makes a function that checks if the given x y is in bounds
 */
export function make_isInBounds({
	width,
	height,
}: {
	width: number,
	height: number,
}) {
	return function(x: number, y: number) {
		return x >= 0 && y >= 0 && x < width && y < height
	}
}

/**
 * Makes a function that compares a position with the first position
 */
export function make_cmpPos({ x: x1, y: y1 }: { x: number, y: number }) {
	return function({ x: x2, y: y2 }: { x: number, y: number }) {
		return x1 === x2 && y1 === y2
	}
}

/**
 * Compare two points and returns true if they are the same
 */
export function cmpPts(
	{ x: x1, y: y1 }: { x: number, y: number },
	{ x: x2, y: y2 }: { x: number, y: number }
) {
	return x1 === x2 && y1 === y2
}

/**
 * Used to filter an array of entities by position
 */
export function byPosition({ x, y }: { x: number, y: number }) {
	return function(entity: any) {
		return cmpPts(entity?.position, { x, y })
	}
}

/**
 * Makes a function that returns the distance of the second point with the first
 */
export function make_distanceTo({ x: x1, y: y1 }: { x: number, y: number }) {
	return function({ x: x2, y: y2 }: { x: number, y: number }) {
		return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
	}
}

/**
 * Returns an array of entites with the component and that will tick this update
 */
export function findByCanTick(component: string): Array<any> {
	return findByComponent(component).filter(c => c?.speed.canTick || !c.speed)
}
