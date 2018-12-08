import "./style.css"
import Game from "./lib/game"

let tps = 20
let old = 0
let game = new Game()

requestAnimationFrame(function raf(time) {
	if (time - old > 1000 / tps) {
		game.tick()
		old = time
	}
	requestAnimationFrame(raf)
})
