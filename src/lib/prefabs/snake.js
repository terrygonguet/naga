import { entity } from "geotic"

export function make({ speed = 4, direction, position } = {}) {
	return entity()
		.add("snake", { position, direction })
		.add("controller")
		.add("speed", speed)
}
