import _order from "./order.json"

/**
 * A container for hitbox data
 * @param {Entity} e The entity to attach the component to
 * @param {Object} params
 * @param {Boolean} [params.blocksSight] if the entity blocks fov
 * @param {Boolean} [params.blocksMoving] if the entity blocks movement
 * @param {Boolean} [params.canBeKilled] if the entity can be killed by the player
 * @param {Boolean} [params.givesLength] if the entity gives the player more length when they eat it
 */
export function hitbox(
	e,
	{
		blocksSight = false,
		blocksMoving = false,
		canBeKilled = false,
		givesLength = false,
	} = {}
) {
	return { blocksMoving, blocksSight, canBeKilled, givesLength }
}

export function update(game) {}

export { hitbox as component }
export const name = "hitbox"
export const order = _order[name]
