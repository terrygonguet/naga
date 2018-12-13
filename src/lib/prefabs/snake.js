import { entity } from "geotic"

export function make({ speed = 4, position } = {}) {
	return entity()
		.add("snake", { position })
		.add("controller")
		.add("speed", speed)
}
