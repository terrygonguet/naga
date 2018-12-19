import { directions } from "../directions"
import { vec2 } from "gl-matrix"
import { animations } from "../blocks"

import { make as makeProjectile } from "../prefabs/projectile"
import { make as makeWizard } from "../prefabs/wizard"
import { make as makeAprentice } from "../prefabs/apprentice"
import { make as makeKnight } from "../prefabs/knight"
import { make as makeSlime } from "../prefabs/slime"
import { findById } from "geotic"
import { isPositionBlocked, findByPosition } from "../tools"

/**
 * state update function for boss phase 1
 * @param {Object} params
 * @param {Object} params.entity
 * @param {Object} params.closestSnake
 * @param {Object} params.game
 * @param {Object} params.machine
 */
export function update({ entity, closestSnake, game, machine }) {
	let snake = entity.snake
	let { chanceToFire, chanceToSpawnShadow } = entity.ai.data
	if (!snake.direction) snake.direction = directions.up
	else if (snake.lastDirection) snake.direction = snake.lastDirection

	let head = findById(snake.head)

	if (game.rng() < chanceToFire) {
		let direction = vec2.subtract(
			vec2.create(),
			[game.width / 2, game.height / 2],
			head.position
		)
		let p = makeProjectile({
			position: head.position,
			direction,
			speed: 8,
			frames: animations.magic,
			causesDamage: true,
			pierces: false,
		})
		p.on("move", () => {
			if (game.rng() < 0.06) {
				spawn(game, p.position, chanceToSpawnShadow, entity)
				setTimeout(() => findById(p.id)?.destroy(), 0)
			}
		})
	}
	return entity.ai.state
}

function spawn(game, position, chanceToSpawnShadow, boss) {
	// if there's anything other than the projectile here we return
	if (findByPosition(position).length > 1) return
	let r = game.rng()
	let e
	if (r < 0.1)
		e = makeWizard({
			position,
			flipAnim: game.rng() < 0.5,
			flipV: game.rng() < 0.5,
		})
	else if (r < 0.2)
		e = makeAprentice({
			position,
			flipAnim: game.rng() < 0.5,
			flipV: game.rng() < 0.5,
		})
	else if (r < 0.3)
		e = makeKnight({
			position,
			flipAnim: game.rng() < 0.5,
			flipV: game.rng() < 0.5,
		})
	else
		e = makeSlime({
			position,
			isRed: game.rng() < 0.5,
			flipAnim: game.rng() < 0.5,
			flipV: game.rng() < 0.5,
		})

	if (game.rng() < chanceToSpawnShadow) {
		e.hitbox.givesLength = false
		e.sprite.texture.alpha = 0.5
	} else {
		e.on("hit", () => {
			let direction = vec2.sub(
				vec2.create(),
				findById(boss.snake.head).position,
				e.position
			)
			let p = makeProjectile({
				position: e.position,
				direction,
				speed: 10,
				frames: animations.magic,
				causesDamage: true,
				pierces: true,
			})
			p.on("collide", target => {
				if (target?.snake?.isPlayer) {
					target.snake.length++ // cause it just got hit
					target.remove("invincible")
					target.emit("invincibleend")
				} else boss.snake.length--
			})
		})
	}
}
