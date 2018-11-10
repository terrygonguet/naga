<template>
	<div class="screen">
		<div 
			v-for="(cell,i) of game.grid" :key="i"
			:class="['cell', cell]"></div>
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
	mounted() {
		let screen = document.querySelector(".screen")
		screen.style.setProperty(
			"grid-template-rows",
			`repeat(${this.game.width}, auto)`
		)
		screen.style.setProperty(
			"grid-template-columns",
			`repeat(${this.game.height}, auto)`
		)
		setInterval(() => this.game.tick(), 1000 / this.tps)
	},
}
</script>

<style scoped>
.screen {
	display: grid;
}

.cell {
	width: 16px;
	height: 16px;
	background-image: url("../assets/micro_dungeon_tileset.png");
	background-repeat: no-repeat;
}

.wall-top {
	background-position: -16px 0px;
}
.wall {
	background-position: 0px -16px;
}

.snake {
	background-position: -16px -48px;
}
.snake-head-right {
	background-position: -32px -48px;
}
.snake-head-left {
	background-position: -32px -48px;
	transform: rotate(180deg);
}
.snake-head-up {
	background-position: -32px -48px;
	transform: rotate(-90deg);
}
.snake-head-down {
	background-position: -32px -48px;
	transform: rotate(90deg);
}

.fruit {
	background-position: -96px -64px;
}

.empty {
	background-position: -16px -16px;
}
</style>
