<template>
	<div class="screen">
		<div 
			v-for="(cell,i) of game.background" :key="i"
			:class="['cell', cell]"></div>
		<div class="absolute screen">
			<div
				v-for="(cell,i) of game.foreground" :key="i"
				:class="[cell ? `cell ${cell}` : '', 'foreground']"></div>
		</div>
	</div>
</template>

<script>
import Game from "../lib/game.js"
import spriteSheet from "../assets/micro_dungeon_tileset.png"

export default {
	data() {
		return {
			game: new Game(),
			tps: 7,
			spriteWidth: 16,
			spriteHeight: 16,
			spriteSheet,
			sprites: {
				"wall-top": [1, 0],
				wall: [0, 1],
				"wall-top-right": [2, 0],
				"wall-top-left": [0, 0],
				"wall-bottom-right": [2, 2],
				"wall-bottom-left": [0, 2],
				snake: [1, 3],
				"snake-head-right": [2, 3],
				"snake-head-left": [2, 3, 180],
				"snake-head-up": [2, 3, -90],
				"snake-head-down": [2, 3, 90],
				empty: [1, 1],
				shadow: [0, 3],
				door: [4, 3],
			},
		}
	},
	mounted() {
		let css = document.createElement("style")
		document.head.append(css)
		let sheet = css.sheet

		sheet.insertRule(`.screen {
			display: grid;
			grid-template-rows: repeat(${this.game.height}, ${this.spriteHeight}px);
			grid-template-columns: repeat(${this.game.width}, ${this.spriteWidth}px);
		}`)
		sheet.insertRule(`.cell {
			width: ${this.spriteWidth}px;
			height: ${this.spriteHeight}px;
			background-image: url("${this.spriteSheet}");
			background-repeat: no-repeat;
		}`)
		for (const sprite in this.sprites) {
			if (this.sprites.hasOwnProperty(sprite)) {
				const position = this.sprites[sprite]
				sheet.insertRule(`.${sprite} {
					background-position: -${position[0] * this.spriteWidth}px -${position[1] *
					this.spriteHeight}px;
					${position[2] ? "transform: rotate(" + position[2] + "deg);" : ""}
				}`)
			}
		}

		setInterval(() => this.game.tick(), 1000 / this.tps)
	},
}
</script>
