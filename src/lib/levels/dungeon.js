import { clear, entity } from "geotic"
import { findRandomFreePosition, make_i2xy } from "../tools"
import { blocks } from "../blocks"

import { make as makeDungeon } from "../prefabs/dungeon"
import { make as makeSlime } from "../prefabs/slime"
import { make as makeAprentice } from "../prefabs/apprentice"
import { make as makeWizard } from "../prefabs/wizard"
import { make as makeKnight } from "../prefabs/knight"
import { make as makeSnake } from "../prefabs/snake"
import { make as makeKey } from "../prefabs/key"
import { make as makePortal } from "../prefabs/portal"

/**
 * Clear up entities and load the dungeon level
 * @param {Game} game
 */
export function switchTo(game) {
	clear()
	let dungeon = makeDungeon({
		roomWidth: 9,
		roomHeight: 9,
		nbRoomW: 7,
		nbRoomH: 7,
		rng: game.rng,
	})
	game.width = dungeon.width
	game.height = dungeon.height

	entity().tag("game", { ref: game }) // global reference
	entity().add("background", { sprites: dungeon })

	let { width, height } = game.layers.background
	game.stage.position.set(
		innerWidth / 2 - width / 2,
		innerHeight / 2 - height / 2
	)

	makeSnake()
	makeKey({ position: findRandomFreePosition(game) })
	makePortal({ position: findRandomFreePosition(game) })

	entity().add("fogOfWar", {
		width: game.width,
		height: game.height,
	})

	// "Instructions"
	entity()
		.add("position", [2, -2])
		.add("sprite", { texture: blocks.key })
	entity()
		.add("position", [4, -2])
		.add("sprite", { texture: blocks.magic.s7 })
	entity()
		.add("position", [6, -2])
		.add("sprite", { texture: blocks.portal })

	// make some enemies on empty spaces
	let max = game.width + Math.round((game.rng() * game.height) / 2)
	let i2xy = make_i2xy(game.width)
	for (let i = 0; i < max; i++) {
		let position = findRandomFreePosition(game)

		let r = game.rng()
		if (r < 0.1)
			makeWizard({
				position,
				flipAnim: game.rng() < 0.5,
				flipV: game.rng() < 0.5,
			})
		else if (r < 0.2)
			makeAprentice({
				position,
				flipAnim: game.rng() < 0.5,
				flipV: game.rng() < 0.5,
			})
		else if (r < 0.3)
			makeKnight({
				position,
				flipAnim: game.rng() < 0.5,
				flipV: game.rng() < 0.5,
			})
		else
			makeSlime({
				position,
				isRed: game.rng() < 0.5,
				flipAnim: game.rng() < 0.5,
				flipV: game.rng() < 0.5,
			})
	}
}
