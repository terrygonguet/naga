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
				// "block-name": [x, y, <rotation>]
				"wall-top": [2, 1],
				wall: [1, 2],
				"wall-top-right": [3, 1],
				"wall-top-left": [1, 1],
				"wall-bottom-right": [3, 3],
				"wall-bottom-left": [1, 3],
				snake: [2, 4],
				"snake-head-right": [3, 4],
				"snake-head-left": [3, 4, 180],
				"snake-head-up": [3, 4, -90],
				"snake-head-down": [3, 4, 90],
				empty: [2, 2],
				unknown: [1, 4],
				door: [5, 4],
				"enemy-red-1": [1, 5],
				"enemy-red-2": [2, 5],
				"enemy-green-1": [3, 5],
				"enemy-green-2": [4, 5],
			},
		}
	},
	mounted() {
		let css = document.createElement("style")
		document.head.append(css)
		let sheet = css.sheet

		// grids and cells common props
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

		// modifiers
		sheet.insertRule(`.flipV {
			filter: flipV;
			transform: scaleX(-1);
		}`)
		sheet.insertRule(`.flipH {
			filter: flipH;
			transform: scaleY(-1);
		}`)
		sheet.insertRule(`.highlight {
			filter: brightness(150%);
		}`)

		// create a rule for each sprite
		for (const sprite in this.sprites) {
			if (this.sprites.hasOwnProperty(sprite)) {
				const position = this.sprites[sprite]
				sheet.insertRule(`.${sprite} {
					background-position: -${(position[0] - 1) *
						this.spriteWidth}px -${(position[1] - 1) * this.spriteHeight}px;
					${position[2] ? "transform: rotate(" + position[2] + "deg);" : ""}
				}`)
			}
		}
		sheet.insertRule(`.shadow {
			background: rgba(0,0,0,0.5);
			background-position: 1000px 1000px;
		}`)

		// TODO : use RAF
		setInterval(() => this.game.tick(), 1000 / this.tps)
	},
}
</script>
