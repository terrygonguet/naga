import { make as makeBossroom } from "../prefabs/bossroom"
import { clear, entity } from "geotic"

import { make as makeSnake } from "../prefabs/snake"

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

	let { width, height } = game.layers.background
	game.stage.position.set(
		innerWidth / 2 - width / 2,
		innerHeight / 2 - height / 2
	)

	makeSnake({ position: [Math.floor(dungeon.width / 2), dungeon.height - 4] })
}
