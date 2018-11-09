import "./style.css"
import Vue from "vue/dist/vue.esm.browser"

import Game from "./components/Game.vue"

let app = new Vue({
	el: "#container",
	components: {
		Game,
	},
})
