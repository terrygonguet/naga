import { entity, getTag, findById } from "geotic"
import { vec2 } from "gl-matrix"
import { blocks } from "../blocks"
import { switchTo as switchToBoss } from "../levels/boss"

export function make({ position }) {
	let e = entity()
		.add("position", vec2.clone(position))
		.add("hitbox", { blocksMoving: true })
		.add("sprite", { texture: blocks.portal })
		.on("hit", () => {
			let keyEnt = findById(getTag("key").id)
			if (keyEnt.item.pickedUp) {
				e.sprite.texture = blocks.portalOpen
				keyEnt.destroy()
				let snakeEnt = findById(getTag("snake").id)
				let fakeBody = []
				snakeEnt.snake.body.forEach(b => {
					let bodyPart = findById(b)
					fakeBody.push(
						entity()
							.add("position", bodyPart.position)
							.add("sprite", { texture: blocks.snake })
					)
				})

				// we can't destroy snake immediately because the "hit" handler is called in snake system
				setTimeout(() => {
					snakeEnt.destroy()
				}, 0)

				let ticker = entity()
					.add("ticker")
					.add("speed", 4)
					.on("tick", () => {
						fakeBody.shift().destroy()
						if (!fakeBody.length) {
							ticker.destroy()
							setTimeout(() => {
								switchToBoss(getTag("game").ref)
							}, 0)
						}
					})
			}
		})
	e.tag("portal", { id: e.id })
	return e
}
