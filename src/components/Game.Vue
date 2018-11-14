<template>
	<canvas id="screen">
		Get a decent browser please
	</canvas>
</template>

<script>
import Game from "../lib/game"
import Renderer from "../lib/renderer"

export default {
	data() {
		let game = new Game()
		let renderer = new Renderer({
			el: "#screen",
			width: game.width,
			height: game.height,
		})
		return {
			game,
			renderer,
		}
	},
	mounted() {
		let self = this
		requestAnimationFrame(function raf(now) {
			self.game.tick()
			requestAnimationFrame(raf)
		})
	},
}
</script>

<style>
#screen {
	width: 100%;
	height: 100%;
}
</style>
