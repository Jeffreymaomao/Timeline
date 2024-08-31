import {
	createAndAppendDOM
} from "./tools.js";

import { Timeline } from "./timeline.js";

window.addEventListener("load",()=>{
	window.app = new App();
});

class App {
	constructor(config={}) {
		this.initializeDOM(config.parentDOM || document.body);
		this.timeline = new Timeline({parentDOM: this.dom.content});
	}

	initializeDOM(parentDOM) {
		this.dom = { parentDOM };
		// ---
		this.dom.header = createAndAppendDOM(this.dom.parentDOM, "header.header");
		this.dom.main = createAndAppendDOM(this.dom.parentDOM, "main.main");
		// ---
		this.dom.topBar = createAndAppendDOM(this.dom.header, "div.top-bar");
		this.dom.content = createAndAppendDOM(this.dom.main, "div.content");
	}
}