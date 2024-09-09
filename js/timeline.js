import {
    createAndAppendDOM,
    formatDate
} from "./tools.js";

class Timeline {
    constructor(config) {
        this.resolution = 2;
        this.ctx = null;
        this.mousePosition = null;

        this.pixelsPerMillisecond = null;
        this.incrementMilliseconds = null;
        this.deltaPixel = null
        this.scaleRatio = 1;
        this._scaleRatioX = 0.9;
        this._scaleRatioY = 2;
        this.plotStartTime = null;
        this.formatString = null;

        this.range = {
            start: {
                date: new Date(),
                time: null
            },
            end: {
                date: new Date(),
                time: null
            },
            duration: null,
            min: 1000, // 1 second in ms
            max: 1000 * 60 * 60 * 24 * 365.5 * 100 // ~1 centry in ms
        };
        // this.range.start.date.setSeconds(this.range.start.date.getSeconds() - 1);
        // this.range.end.date.setSeconds(this.range.end.date.getSeconds() + 1);

        // this.range.start.date.setMinutes(this.range.start.date.getMinutes() - 5);
        // this.range.end.date.setMinutes(this.range.end.date.getMinutes() + 5);

        // this.range.start.date.setMinutes(this.range.start.date.getMinutes() - 20);
        // this.range.end.date.setMinutes(this.range.end.date.getMinutes() + 20);

        this.range.start.date.setHours(this.range.start.date.getHours() - 12);
        this.range.end.date.setHours(this.range.end.date.getHours() + 12);

        this.calculateGridInformation();
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
        this.calculateGridInformation();
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

    calculateGridInformation() {
        this.range.start.time = this.range.start.date.getTime();
        this.range.end.time = this.range.end.date.getTime();
        this.range.duration = this.range.end.time - this.range.start.time;

        const grdiWidthPixels = this.dom ? this.dom.grid.width : 100;
        this.pixelsPerMillisecond =  grdiWidthPixels / this.range.duration;

        let plotStartDate = new Date(this.range.start.time);

        switch (true) {
            // ---
            case (this.range.duration <= 1000 * 1): // 小於等於 1 秒
                this.incrementMilliseconds = 50; // 間隔 100 毫秒
                this.formatString = ":ss.fff";
                this.scaleRatio = 0.1;
                plotStartDate.setMilliseconds(0);
                break;
            case (this.range.duration <= 1000 * 5): // 小於等於 5 秒
                this.incrementMilliseconds = 200; // 間隔 200 毫秒
                this.formatString = ":ss.fff";
                this.scaleRatio = 0.5;
                plotStartDate.setMilliseconds(0);
                break;
            case (this.range.duration <= 1000 * 10): // 小於等於 10 秒
                this.incrementMilliseconds = 500; // 間隔 500 毫秒
                this.formatString = ":ss.fff";
                this.scaleRatio = 1;
                plotStartDate.setMilliseconds(0);
                break;
            case (this.range.duration <= 1000 * 30): // 小於等於 30 秒
                this.incrementMilliseconds = 1000; // 間隔 1 秒
                this.formatString = "mm:ss";
                this.scaleRatio = 5;
                plotStartDate.setMilliseconds(0);
                break;
            // ---
            case (this.range.duration <= 1000 * 60 * 2): // 小於等於 2 分鐘
                this.incrementMilliseconds = 1000 * 5; // 間隔 5 秒
                this.formatString = "mm:ss";
                this.scaleRatio = 10;
                plotStartDate.setSeconds(0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 5): // 小於等於 5 分鐘
                this.incrementMilliseconds = 1000 * 10; // 間隔 10 秒
                this.formatString = "mm:ss";
                this.scaleRatio = 30;
                plotStartDate.setSeconds(0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 10): // 小於等於 10 分鐘
                this.incrementMilliseconds = 1000 * 20; // 間隔 15 秒
                this.formatString = "mm:ss";
                this.scaleRatio = 60;
                plotStartDate.setSeconds(0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 15): // 小於等於 15 分鐘
                this.incrementMilliseconds = 1000 * 30; // 間隔 30 秒
                this.formatString = "mm:ss";
                this.scaleRatio = 100;
                plotStartDate.setSeconds(0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 20): // 小於等於 20 分鐘
                this.incrementMilliseconds = 1000 * 60; // 間隔 1 分鐘
                this.formatString = "mm:ss";
                this.scaleRatio = 120;
                plotStartDate.setSeconds(0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 30): // 小於等於 30 分鐘
                this.incrementMilliseconds = 1000 * 60; // 間隔 2 分鐘
                this.formatString = "mm:ss";
                this.scaleRatio = 200;
                plotStartDate.setSeconds(0, 0);
                break;
            // ---
            case (this.range.duration <= 1000 * 60 * 60 * 1): // 小於等於 1 小時
                this.incrementMilliseconds = 1000 * 60 * 5; // 間隔 5 分鐘
                this.formatString = "HH:mm";
                this.scaleRatio = 400;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 2): // 小於等於 2 小時
                this.incrementMilliseconds = 1000 * 60 * 10; // 間隔 10 分鐘
                this.formatString = "HH:mm";
                this.scaleRatio = 600;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 4): // 小於等於 4 小時
                this.incrementMilliseconds = 1000 * 60 * 15; // 間隔 15 分鐘
                this.formatString = "HH:mm";
                this.scaleRatio = 1000;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 6): // 小於等於 6 小時
                this.incrementMilliseconds = 1000 * 60 * 20; // 間隔 20 分鐘
                this.formatString = "HH:mm";
                this.scaleRatio = 2000;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 12): // 小於等於 12 小時
                this.incrementMilliseconds = 1000 * 60 * 30; // 間隔 30 分鐘
                this.formatString = "HH:mm";
                this.scaleRatio = 4000;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            // ---
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 1): // 小於等於 1 天
                this.incrementMilliseconds = 1000 * 60 * 60; // 間隔小時
                this.formatString = "HH:mm";
                this.scaleRatio = 6000;
                plotStartDate.setMinutes(0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 2): // 小於等於 2 天
                this.incrementMilliseconds = 1000 * 60 * 60 * 6; // 間隔 6 小時
                this.formatString = "MM/dd HH:mm";
                this.scaleRatio = 20000;
                plotStartDate.setHours(0, 0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 4): // 小於等於 4 天
                this.incrementMilliseconds = 1000 * 60 * 60 * 12; // 間隔 12 小時
                this.formatString = "MM/dd HH:mm";
                this.scaleRatio = 40000;
                plotStartDate.setHours(0, 0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 7): // 小於等於 1 週
                this.incrementMilliseconds = 1000 * 60 * 60 * 24; // 間隔 1 天
                this.formatString = "(ddd) MM/dd";
                this.scaleRatio = 60000;
                plotStartDate.setHours(0, 0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 14): // 小於等於 2 週
                this.incrementMilliseconds = 1000 * 60 * 60 * 24; // 間隔 1 天
                this.formatString = "(ddd) MM/dd";
                this.scaleRatio = 100000;
                plotStartDate.setHours(0, 0, 0, 0);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 28): // 小於等於 1 月
                this.incrementMilliseconds = 1000 * 60 * 60 * 24; // 間隔 1 天
                this.formatString = "MM/dd";
                this.scaleRatio = 200000;
                plotStartDate.setHours(0, 0, 0, 0);
                break;
            // ---
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 28 * 2): // 小於等於 2 月
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 4; // 間隔 4 天
                this.formatString = "MM/dd";
                this.scaleRatio = 400000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 365.2425 * 0.25): // 小於等於 4 月
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 7; // 間隔 1 週
                this.formatString = "MM/dd";
                this.scaleRatio = 600000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 365.2425 * 0.5): // 小於等於 6 月
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 14; // 間隔 14 天
                this.formatString = "yyyy/MM/dd";
                this.scaleRatio = 1000000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;
            case (this.range.duration <= 1000 * 60 * 60 * 24 * 365.2425): // 小於等於 1 年
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 28; // 間隔 ~1 月
                this.formatString = "yyyy/MM/dd";
                this.scaleRatio = 2000000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;

            case (this.range.duration <= 1000 * 60 * 60 * 24 * 365.2425 * 2): // 小於等於 2 年
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 365.2425 * 0.25; // 間隔 0.25年
                this.formatString = "yyyy/MM";
                this.scaleRatio = 6000000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;

            case (this.range.duration <= 1000 * 60 * 60 * 24 * 365.2425 * 5): // 小於等於 5 年
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 365.2425 * 0.5; // 間隔 0.5年
                this.formatString = "yyyy/MM";
                this.scaleRatio = 50000000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setMonth(0, 1);
                break;
            default: // 大於 
                this.incrementMilliseconds = 1000 * 60 * 60 * 24 * 365.5 * 5; // 間隔 1 年
                this.formatString = "yyyy";
                this.scaleRatio = 100000000;
                plotStartDate.setHours(0, 0, 0, 0);
                plotStartDate.setFullYear(1969, 0, 1);
                break;
        }
        this.plotStartTime = plotStartDate.getTime();
    }

    drawGrid() {
        const gridWidth = this.dom.grid.width;
        const gridHeight = this.dom.grid.width;
        const startPixel = (this.plotStartTime - this.range.start.time) * this.pixelsPerMillisecond;
        const deltaPixel = this.incrementMilliseconds * this.pixelsPerMillisecond;

        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        
        let num = 0; const max_num = gridWidth*this.resolution;
        for (let x = startPixel; x <= gridWidth; x += deltaPixel) {
            if(num>max_num) return;
        	this.ctx.beginPath();
        	this.ctx.moveTo(x, 0);
        	this.ctx.lineTo(x, gridHeight);
        	this.ctx.stroke();
            num ++;
        }
    }

    drawLabel() {
        const gridWidth = this.dom.grid.width;
        const gridHeight = this.dom.grid.height;

        const bottom = 200;
        const fontSize = 15;
        this.ctx.fillStyle = '#000';
        this.ctx.font = `${fontSize*this.resolution}px Arial`;
        this.ctx.textAlign = 'center';

        const startPixel = (this.plotStartTime - this.range.start.time) * this.pixelsPerMillisecond;
        let deltaPixel = this.incrementMilliseconds * this.pixelsPerMillisecond;

        let currentDate = new Date(this.plotStartTime);
        let num = 0; const max_num = 100;
        for (let x = startPixel; x <= gridWidth; x += deltaPixel) {
            if(num>max_num) return;
            const timeLabel = formatDate(currentDate, this.formatString, false);
            this.ctx.fillText(timeLabel, x, gridHeight - bottom);
            currentDate = new Date(currentDate.getTime() + this.incrementMilliseconds);
            num++;
        }
    }

    checkRange() {
        const startTime = this.range.start.time;
        const endTime = this.range.end.time;
        const minDuration = this.range.min;

        // if(startTime + minDuration > endTime){
        //     const midTime = (startTime + endTime) * 0.5;
        //     this.range.start.date = new Date(midTime - minDuration*0.5);
        //     this.range.end.date = new Date(midTime + minDuration*0.5);
        //     console.log("not good in checkRange");
        //     return;
        // }
    }

    draw() {
        this.checkRange();
        this.calculateGridInformation();

        // draw
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
            e.preventDefault();
            const startTime = this.range.start.time;
            const endTime = this.range.end.time;
            const minDuration = this.range.min;
            const maxDuration = this.range.max;

            let deltaY = e.deltaY * this.scaleRatio * this._scaleRatioY;
            let newStartDate = new Date(startTime - deltaY);
            let newEndDate = new Date(endTime + deltaY);

            if(e.deltaY<0 && startTime + minDuration > endTime){
                return;
            } else if(e.deltaY>0 && endTime - startTime > maxDuration){
                return;
            } else if(e.deltaX) {
                const deltaX = e.deltaX * this.scaleRatio * this._scaleRatioX;
                newStartDate = new Date(startTime + deltaX);
                newEndDate = new Date(endTime + deltaX);
            }

            this.range.start.date = newStartDate;
            this.range.end.date = newEndDate;
            this.draw();
        }.bind(this), { passive: false });
    }
}

export { Timeline };