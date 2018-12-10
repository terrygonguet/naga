import { entity } from "geotic"
import { vec2 } from "gl-matrix"

export function make({
	position,
	direction,
	speed,
	frames,
	causesDamage = true,
	pierces = false,
}) {
	return entity()
		.add("position", vec2.clone(position))
		.add("sprite", { texture: frames[0][0] })
		.add("animation", { frames })
		.add("hitbox")
		.add("speed", { speed })
		.add("projectile", { direction, causesDamage, pierces })
		.tag("projectile")
}
