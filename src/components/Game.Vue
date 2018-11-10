<template>
	<div class="screen">
		<div 
			v-for="(cell,i) of game.grid" :key="i" 
			class="cell" 
			:class="cellClass(cell)"></div>
	</div>
</template>

<script>
import Game from "../lib/game.js"

export default {
	data() {
		return {
			game: new Game(),
			tps: 7,
		}
	},
	methods: {
		tick() {
			this.game.tick()
		},
		cellClass(cell) {
			switch (cell) {
				case "wall":
					return "bg-white"
				case "snake":
					return "bg-green-light"
				case "fruit":
					return "bg-red"
				default:
					return "bg-black"
			}
		},
	},
	mounted() {
		setInterval(this.tick, 1000 / this.tps)
	},
}
</script>

<style>
.screen {
	display: grid;
	grid-template-columns: repeat(46, auto);
	grid-template-rows: repeat(46, auto);
}

.cell {
	width: 1em;
	height: 1em;
}
</style>
