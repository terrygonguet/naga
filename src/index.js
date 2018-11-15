import "./style.css"
import Game from "./lib/game"
import Renderer from "./lib/renderer"

let tps = 20
let old = 0
let game = new Game()
let renderer = new Renderer({
	el: "#screen",
	width: game.width,
	height: game.height,
})

requestAnimationFrame(function raf(time) {
	if (time - old > 1000 / tps) {
		game.tick()
		renderer.setLayers(game)
		old = time
	}
	requestAnimationFrame(raf)
})
