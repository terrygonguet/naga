export let directions = {
	up: "ArrowUp",
	left: "ArrowLeft",
	down: "ArrowDown",
	right: "ArrowRight",
}

export function setDirections({ up, down, left, right }) {
	directions = { up, down, left, right }
}

export function oppositeDirection(direction) {
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
