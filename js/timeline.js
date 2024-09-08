import {
    createAndAppendDOM,
    formatDate
} from "./tools.js";

class Timeline {
    constructor(config) {
        this.resolution = 2;
        this.ctx = null;
        this.mousePosition = null;
        this.range = { start: new Date(), end: new Date(), center: new Date() };
        this.range.start.setHours(this.range.start.getHours() - 6);
        this.range.end.setHours(this.range.end.getHours() + 6);

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
        if (!this.mousePosition) return;
        const { x, y } = this.mousePosition;

        this.ctx.strokeStyle = '#0000ff';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.dom.grid.height);
        this.ctx.stroke();
    }

    drawGrid() {
        const grid = this.dom.grid;
        const startTime = this.range.start.getTime();
        const endTime = this.range.end.getTime();
        const totalDuration = endTime - startTime;
        const pixelPerMillisecond = grid.width / totalDuration; // px / ms

        let currentDate = new Date(startTime);
        currentDate.setMinutes(0, 0, 0);
        const currentTime = currentDate.getTime();

        const startPixel = (currentTime - startTime) * pixelPerMillisecond;
        const deltaPixel = 1000 * pixelPerMillisecond

        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        if(startPixel > grid.width) return;
        let num = 0; const max_num = grid.width*this.resolution;
        for (let x = startPixel; x <= grid.width; x += deltaPixel) {
            if(num>max_num) return;
        	this.ctx.beginPath();
        	this.ctx.moveTo(x, 0);
        	this.ctx.lineTo(x, grid.height);
        	this.ctx.stroke();
            num ++;
        }
    }

    drawLabel() {
        const grid = this.dom.grid;
        const bottom = 200;
        const fontSize = 10;
        const startTime = this.range.start.getTime();
        const endTime = this.range.end.getTime();

        const totalDuration = rangeEnd - rangeStart;
        const pixelsPerMillisecond = grid.width / totalDuration; // 每毫秒對應的像素數

        let incrementMilliseconds;
        let formatString;
        let timecase = null;
        switch (true) {
            case (totalDuration <= 1000 * 60): // 小於一分鐘
                timecase = "小於一分鐘";
                incrementMilliseconds = 1000 * 1; // 每 10 秒
                formatString = ":ss";
                break;
			case (totalDuration <= 1000 * 60 * 30): // 小於等於半小時
    			timecase = "小於等於一小時";
		        incrementMilliseconds = 1000 * 30; // 每 10 秒
		        formatString = "HH:mm";
		        break;
            case (totalDuration <= 1000 * 60 * 60): // 小於等於一小時
                timecase = "小於等於一小時";
                incrementMilliseconds = 1000 * 60; // 每分鐘
                formatString = "HH:mm";
                break;
            case (totalDuration <= 1000 * 60 * 60 * 12): // 小於等於半天
                timecase = "小於等於半天";
                incrementMilliseconds = 1000 * 60 * 30; // 每 30 分鐘
                formatString = "HH:mm";
                break;
            case (totalDuration <= 1000 * 60 * 60 * 24): // 小於等於一天
                timecase = "小於等於一天";
                incrementMilliseconds = 1000 * 60 * 60; // 每小時
                formatString = "HH:mm";
                break;
            case (totalDuration <= 1000 * 60 * 60 * 24 * 7): // 小於等於一週
                timecase = "小於等於一週";
                incrementMilliseconds = 1000 * 60 * 60 * 6; // 每 6 小時
                formatString = "MM/dd HH:mm";
                break;
            case (totalDuration <= 1000 * 60 * 60 * 24 * 30): // 小於等於一個月
                timecase = "小於等於一個月";
                incrementMilliseconds = 1000 * 60 * 60 * 24; // 每天
                formatString = "MM/dd";
                break;
            default: // 大於一個月
                timecase = "大於一個月";
                incrementMilliseconds = 1000 * 60 * 60 * 24 * 7; // 每週
                formatString = "MM/dd/yyyy";
                break;
        }

        // const _t1 = this.range.start.getTime() - this.range.center.getTime(),
        //     _t2 = this.range.end.getTime() - this.range.center.getTime();
        // // console.log(`${_t1}, ${_t2} ${timecase}`);


        // const t1 = formatDate(this.range.start, "MM/dd HH:mm", false),
        //     t2 = formatDate(this.range.end, "MM/dd HH:mm", false);
        // // console.log(`${t1}, ${t2} ${timecase}`);

        this.ctx.fillStyle = '#000';
        this.ctx.font = `${fontSize*this.resolution}px Arial`;
        this.ctx.textAlign = 'center';

        let currentTime = new Date(rangeStart);
        // currentTime.setMinutes(0, 0, 0);
        const gridDelta = Math.floor(grid.width / gridN);
        
        for (let x = 0; x <= grid.width; x += gridDelta) {
            const timeLabel = formatDate(currentTime, formatString, false);
            this.ctx.fillText(timeLabel,
                x, grid.height - bottom);
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

        window.addEventListener("resize", function(e) {
            this.resizeCanvas();
            this.draw();
        }.bind(this), false);

        grid.addEventListener('mousemove', function(e) {
            const rect = grid.getBoundingClientRect();
            this.mousePosition = {
                x: (e.clientX - rect.left) * this.resolution,
                y: (e.clientY - rect.top) * this.resolution
            };
            requestAnimationFrame(this.draw.bind(this));
        }.bind(this), false);

        grid.addEventListener('mouseout', function(e) {
            this.mousePosition = null;
            requestAnimationFrame(this.draw.bind(this));
        }.bind(this), false);

        grid.addEventListener('wheel', function(e) {
            // return;
            // e.preventDefault();
            const rangeStart = this.range.start.getTime(); // 以毫秒為單位的起始時間
            const rangeEnd = this.range.end.getTime(); // 以毫秒為單位的結束時間
            let delta = e.deltaY * 1000 * 10;
            if (e.deltaY < 0 && rangeEnd - rangeStart < 10000) {
                return;
            }
            this.range.start = new Date(rangeStart - delta);
            this.range.end = new Date(rangeEnd + delta);
            this.draw();
        }.bind(this), false);
        // requestAnimationFrame(this.drawMouseGrid.bind(this));
    }
}

export { Timeline };