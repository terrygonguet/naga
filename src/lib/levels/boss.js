import { make as makeBossroom } from "../prefabs/bossroom"
import { clear, entity } from "geotic"
import { directions } from "../directions"
import { blocks, animations } from "../blocks"

import { make as makeSnake } from "../prefabs/snake"
import { make as makeBoss } from "../prefabs/boss"
import { findByPosition } from "../tools"
import { make } from "../prefabs/slime"

/**
 * Clear up entities and load the boss level
 * @param {Game} game
 */
export function switchTo(game) {
	clear()

	let dungeon = makeBossroom()
	game.width = dungeon.width
	game.height = dungeon.height

	entity().tag("game", { ref: game }) // global reference
	entity().add("background", { sprites: dungeon })
	entity()
		.add("position", [Math.floor(dungeon.width / 2), dungeon.height - 1])
		.add("sprite", { texture: blocks.portalOpen })

	let { width, height } = game.layers.background
	game.stage.position.set(
		innerWidth / 2 - width / 2,
		innerHeight / 2 - height / 2
	)

	makeSnake({
		position: [Math.floor(dungeon.width / 2), dungeon.height - 2],
		direction: directions.up,
	})
	makeBoss({
		direction: directions.up,
		position: [Math.floor(dungeon.width / 2), Math.floor(dungeon.height / 2)],
	})

	let effect = entity()
		.add("position", [
			Math.floor(dungeon.width / 2),
			Math.floor(dungeon.height / 2),
		])
		.add("animation", { frames: animations.magic })
		.add("speed", 4)
		.add("ticker")
		.on("tick", () => {
			if (!findByPosition(effect.position).some(e => !!e.tags.snake))
				effect.destroy()
		})
}
