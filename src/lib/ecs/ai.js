import { findByTag } from "geotic"
import { make_distanceTo, findByCanTick } from "../tools"
import _order from "./order.json"
import { Machine } from "xstate"
import { update as updateIdle } from "../ai/idle"
import { update as updateChasing } from "../ai/chasing"

// get the updates functions for the states
const context = require.context("../ai", false, /\.js$/)
const stateUpdates = {}
for (const path of context.keys()) {
	let { update } = context(path)
	let state = /\.\/(.*)\.js$/.exec(path)[1]
	stateUpdates[state] = update
}

/**
 * Move around randomly for now
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Object} params.machine
 * @param {Object} [params.data]
 */
export function ai(e, { data, machine } = {}) {
	return {
		data,
		machine,
		state: machine.initial,
	}
}

export function update(game) {
	findByCanTick("ai").forEach(ent => {
		if (!ent.position) return

		let { state, machine } = ent.ai
		let pos = ent.position
		let distanceTo = make_distanceTo(pos)
		let closestSnake = findByTag("snake").sort((a, b) =>
			distanceTo(a.position) < distanceTo(b.position) ? -1 : 1
		)[0]
		if (!closestSnake) return // whatever
		let aimachine = Machine(machine)

		ent.ai.state = stateUpdates[state]({
			game,
			closestSnake,
			entity: ent,
			machine: aimachine,
		})
	})
}

export { ai as component }
export const name = "ai"
export const order = _order[name]
