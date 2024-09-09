import {
    createAndAppendDOM
} from "./tools.js";

import { Timeline } from "./timeline.js";

window.addEventListener("load", () => {
    window.app = new App();
});

class App {
    constructor(config = {}) {
        this.initializeDOM(config.parentDOM || document.body);
        this.timeline = new Timeline({ parentDOM: this.dom.content });
    }

    initializeDOM(parentDOM) {
        this.dom = { parentDOM };
        // ---
        this.dom.header = createAndAppendDOM(this.dom.parentDOM, "header.header");
        this.dom.main = createAndAppendDOM(this.dom.parentDOM, "main.main");
        // ---
        this.dom.topBar = createAndAppendDOM(this.dom.header, "div.top-bar");
        this.dom.content = createAndAppendDOM(this.dom.main, "div.content");

        if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.changeDarkLightMode.bind(this), false);
        if (window.matchMedia) window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this.changeDarkLightMode.bind(this), false);
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(this.isDarkMode) parentDOM.classList.add("dark");
    }

    changeDarkLightMode() {
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    	if(this.isDarkMode){
            this.dom.parentDOM.classList.add("dark");
        } else {
        	this.dom.parentDOM.classList.remove("dark");	
        }
    }
}