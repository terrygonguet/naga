import { entity } from "geotic"

export function make({ speed = 4, direction, position } = {}) {
	let e = entity()
		.add("snake", { position, direction, isPlayer: false, length: 30 })
		.add("ai", {
			data: {
				chanceToFire: 0.1,
				chanceToSpawnShadow: 0.5,
			},
			machine: {
				id: "ai",
				initial: "phase1",
				states: {
					phase1: {
						on: {
							PHASE_END: "phase2",
						},
					},
					phase2: {
						on: {
							PHASE_END: "death",
							CHARGE: "charging",
						},
					},
					charging: {
						on: {
							CHARGE_END: "phase2",
						},
					},
					death: {},
				},
			},
		})
		.add("speed", speed)
		.add("invincible", Infinity)
	e.tag("boss", { id: e.id })
	return e
}
