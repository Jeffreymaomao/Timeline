import {
    createAndAppendDOM,
    formatDate
} from "./tools.js";

class Timeline {
    constructor(config) {
    	this.resolution = 2;
    	this.ctx = null;
    	this.mousePosition = null;
    	this.range = {start: new Date(),end: new Date()};
	    this.range.start.setHours(this.range.start.getHours() - 12);
	    this.range.end.setHours(this.range.end.getHours() + 12);

        this.initializeDOM(config.parentDOM || document.body);
    }

    initializeDOM(parentDOM) {
        this.dom = { parentDOM };
		this.dom.grid = createAndAppendDOM(this.dom.parentDOM, "canvas.grid");
		this.initializeGrid();
    }

    initializeGrid() {
		const grid = this.dom.grid;
		this.ctx = grid.getContext('2d');
		this.resizeCanvas();
		this.bindEvents();
		// ---
		this.draw();
	}

	resizeCanvas() {
		const grid = this.dom.grid;
		const size = [this.dom.parentDOM.clientWidth, this.dom.parentDOM.clientHeight];
		grid.width = size[0] * this.resolution;
		grid.height = size[1] * this.resolution;
		grid.style.width = `${size[0]}px`;
		grid.style.height = `${size[1]}px`;
		this.ctx.clearRect(0, 0, grid.width, grid.height);
	}

	drawMouseGrid() {
		if(!this.mousePosition) return;
		const { x, y } = this.mousePosition;

		this.ctx.strokeStyle = '#0000ff';
		this.ctx.lineWidth = 2;

		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.dom.grid.height);
		this.ctx.stroke();
	}

	drawGrid() {
		// const grid = this.dom.grid;
		// const gridSize = 50;
		// this.ctx.strokeStyle = '#e0e0e0';
		// this.ctx.lineWidth = 1;
		// for (let x = 0; x <= grid.width; x += gridSize*this.resolution) {
		// 	this.ctx.beginPath();
		// 	this.ctx.moveTo(x, 0);
		// 	this.ctx.lineTo(x, grid.height);
		// 	this.ctx.stroke();
		// }
	}

	drawLabel() {
		const grid = this.dom.grid;
		const gridSize = 100;
		const bottom = 150;
		const rangeStart = this.range.start.getTime(); // 以毫秒為單位的起始時間
	    const rangeEnd = this.range.end.getTime(); // 以毫秒為單位的結束時間
	    const totalDuration = rangeEnd - rangeStart; // 時間範圍的總時長
	    const pixelsPerMillisecond = grid.width / totalDuration; // 每毫秒對應的像素數

		this.ctx.fillStyle = '#000';
		this.ctx.font = '28px Arial';
		this.ctx.textAlign = 'center';

		let currentTime = new Date(rangeStart);

		for (let x = 0; x <= grid.width; x += gridSize*this.resolution) {
			const timeLabel = formatDate(currentTime, "hh:mm tt", false);
	        this.ctx.fillText(timeLabel, x, grid.height - bottom);

	        const incrementMilliseconds = gridSize / pixelsPerMillisecond;
	        currentTime = new Date(currentTime.getTime() + incrementMilliseconds);
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.dom.grid.width, this.dom.grid.height);
		this.drawGrid();
		this.drawLabel();
		this.drawMouseGrid();
	}

	bindEvents() {
		const grid = this.dom.grid;
		
		grid.addEventListener('mousemove', (e)=>{
			const rect = grid.getBoundingClientRect();
			this.mousePosition = {
				x: (e.clientX - rect.left) * this.resolution,
				y: (e.clientY - rect.top) * this.resolution
			};
			requestAnimationFrame(this.draw.bind(this));
		});

		grid.addEventListener('mouseout', (e)=>{
			this.mousePosition = null;
			requestAnimationFrame(this.draw.bind(this));
		});

		grid.addEventListener('wheel', (e)=>{
			// e.preventDefault();
			console.log(e);
		})
		// requestAnimationFrame(this.drawMouseGrid.bind(this));
	}
}

export { Timeline };