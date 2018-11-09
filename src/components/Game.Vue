<template>
	<div class="screen">
		<div 
			v-for="cell of game.grid" :key="`${cell.x}_${cell.y}`" 
			class="cell" 
			:class="cellClass(cell)"></div>
	</div>
</template>

<script>
import Game, { directions, setDirections } from "../lib/game.js"

setDirections({
	up: "ArrowUp",
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight",
})

export default {
	data() {
		return {
			game: new Game(),
			tps: 4.4,
			lastKey: null,
		}
	},
	methods: {
		tick() {
			!this.game.lost && this.game.tick(this.lastKey)
		},
		handleKeydown(e) {
			this.lastKey = e.key
		},
		cellClass(cell) {
			if (cell.isFruit) return "bg-red"
			else if (cell.isSnake) return "bg-green-light"
			else if (cell.isWall) return "bg-white"
			else return "bg-black"
		},
	},
	mounted() {
		document.addEventListener("keydown", this.handleKeydown)
		setInterval(this.tick, 1000 / this.tps)
	},
}
</script>

<style>
.screen {
	display: grid;
	grid-template-columns: repeat(50, auto);
	grid-template-rows: repeat(50, auto);
}

.cell {
	width: 1em;
	height: 1em;
}
</style>
