import { entity } from "geotic"

export function make({ speed = 4 } = {}) {
	return entity()
		.add("snake")
		.add("controller")
		.add("speed", { speed })
}
