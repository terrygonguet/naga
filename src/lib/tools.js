export function make_xy2i(width) {
	return function(x, y) {
		if (x < 0 || y < 0) return -1
		return x + y * width
	}
}

export function make_i2xy(width) {
	return function(i) {
		return { x: i % width, y: Math.floor(i / width) }
	}
}

export function make_isInBounds({ width, height }) {
	return function(x, y) {
		return x >= 0 && y >= 0 && x < width && y < height
	}
}

export function make_cmpPos({ x: x1, y: y1 }) {
	return function({ x: x2, y: y2 }) {
		return x1 === x2 && y1 === y2
	}
}
