import { createAndAppendDOM, hash, parseFormattedDate, parseCSV} from "./tools.js";
import { Timeline } from "./timeline.js";

const currentTimeKeyword = [
    'now',
    'current',
    'present',
    'this',
    'today',
    'current time',
    'current date',
    'now time',
    'now date',
];

window.addEventListener("load", () => {
    if (window.self !== window.top) {
        document.body.classList.add("is-iframe");
    }
    const windowParams = new URLSearchParams(window.location.search);
    // ---
    const isUserCheckOverlap = 
        `${windowParams.get('check_overlap')}`.toLowerCase() === 'true' 
        ||
        `${windowParams.get('checkOverlap')}`.toLowerCase() === 'true' 
        ||
        `${windowParams.get('check')}`.toLowerCase() === 'true';
    const fps = Number(windowParams.get('fps')) || 10;
    const app = new App({
        parentDOM: document.body,
        checkOverlap: isUserCheckOverlap,
        fps: fps
    });
    // ---
    let eventLogFile = windowParams.get('events');
    const lineSeperator = windowParams.get('sep') || '|';
    if(eventLogFile) {
        if(lineSeperator) {
            eventLogFile = eventLogFile.replaceAll(lineSeperator, '\n');
        }
        app.loadFile(eventLogFile);
    }
    window.app = app;
    const example = windowParams.get('example');
    if(example==='1') {
        fileTest1(app);
    } if(example==='2') {
        fileTest2(app);
    } else if (example) {
        const num = parseInt(example) || 20;
        randomTest(app, num);
    }
});

const randomTest = (app, num=20)=>{
    app.timeline.clearEvent();
    for(let i=0;i<num;i++){
        const deltaHour = (2.0*Math.random()-1)*1.5;
        const eventDate = new Date(new Date().getTime()+ 1000*60*60*deltaHour);
        eventDate.setMilliseconds(0);
        const hashName = hash(`${deltaHour}`).slice(0,10);
        app.timeline.addEvent({date: eventDate,title: hashName});
    }
}

const fileTest1 = (app)=>{
    let file_content = "HH:mm\n";
    for (let i = 0; i <= 23; i++) {
      let hour = i.toString().padStart(2, "0");
      file_content += `${hour}:00, ${hour}:00 event!\n`;
    }
    app.loadFile(file_content);
}

const fileTest2 = (app)=>{
    let file_content = "HH:mm\n";
    const nowHour = new Date().getHours();
    for (let i = 0; i <= 10; i+=1) {
        let hour = (nowHour+i).toString().padStart(2, "0");
        if(i%2){
            file_content += `${hour}:00, ${hour}:30, ${hour}:00~${hour}:30\n`;
        } else {
            file_content += `${hour}:00, ${hour}:00\n`;
        }
    }
    app.loadFile(file_content);
}

// ---
class App {
    constructor(config = {}) {
        this.initializeDOM(config.parentDOM || document.body);
        this.timeline = new Timeline(Object.assign(config, {
            parentDOM: this.dom.content
        }));
        this.initFileDropEvent();
    }

    initializeDOM(parentDOM) {
        this.dom = { parentDOM };
        // ---
        this.dom.header = createAndAppendDOM(this.dom.parentDOM, "header.header");
        this.dom.main = createAndAppendDOM(this.dom.parentDOM, "main.main");
        // ---
        this.dom.topBar = createAndAppendDOM(this.dom.header, "div.top-bar");
        this.dom.content = createAndAppendDOM(this.dom.main, "div.content");
        // ---
        this.dom.input = createAndAppendDOM(this.dom.main, "input", {
            type: 'file',
            style: 'display:none'
        });

        if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.changeDarkLightMode.bind(this), false);
        if (window.matchMedia) window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this.changeDarkLightMode.bind(this), false);
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(this.isDarkMode) parentDOM.classList.add("dark");
    }

    initFileDropEvent() {
        const dropZone = document.body;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop zone when item is dragged over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('highlight');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('highlight');
            }, false);
        });
        dropZone.addEventListener('drop', handleDrop, false);

        this.dom.input.addEventListener('change', handleDrop, false);

        window.addEventListener('keydown', (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                this.dom.input.click();
            }
        });

        function readFileContent(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    resolve(event.target.result); // Get file content as text
                };
                reader.onerror = function(event) {
                    reject(new Error('Error reading file'));
                };
                reader.readAsText(file);
            });
        }
        const loadFile = this.loadFile.bind(this);
        function handleDrop(e) {
            let dt = e.dataTransfer || e.target;
            let file = dt.files[0]; // only process first one
            document.title = `Timeline - ${file.name}`
            readFileContent(file).then(content => {
                loadFile(content);
                this.value = ''; // clear input to allow re-uploading the same file
            }).catch(error => console.error(error));
        }
    }

    loadFile(file_content) {
        const csvArray = parseCSV(file_content.trim(), ',');
        let dateFormat = '';
        if(csvArray[0].length!=1) {
            dateFormat = prompt(`Plase provie a date format for your time!\n<time format>, <string>\n${file_content.trim()}`);
        } else {
            dateFormat = csvArray.shift()[0]
        }
        dateFormat = dateFormat.trim();
        this.timeline.clearEvent();
        let minDate = null, maxDate = null;
        csvArray.forEach((eventArray)=>{
            if(eventArray.length<2) return;

            const first = eventArray.shift().trim();
            const second = eventArray.shift().trim();

            let color = undefined;
            let last = '';
            if(eventArray.length > 1) {
                for(let i = eventArray.length-1; i>=0; i--) {
                    const last = eventArray.slice(i).join(',')
                    color = last.trim();
                    if(color.startsWith('color=') || color.startsWith('c=')) {
                        color = color.replace('c=','').replace('color=','');
                        eventArray = eventArray.slice(0, i);
                        break;
                    } else {
                        color = undefined; // not a color
                    }
                }
            }
            const rest = eventArray.join(',');

            const date1 = parseFormattedDate(first, dateFormat);
            let maybeDate2 = parseFormattedDate(second, dateFormat);
            if (currentTimeKeyword.includes(second.toLowerCase())) {
                maybeDate2 = 'now';
            }

            if (!maybeDate2 || !rest) {
                this.timeline.addEvent({
                    date: date1,
                    title: (rest ? ([second, rest].join(',').trim()) : second),
                    color: color
                });
                if (!minDate || date1 < minDate) minDate = date1;
                if (!maxDate || date1 > maxDate) maxDate = date1;
            } else {
                this.timeline.addRangeEvent({
                    date: date1,
                    end: maybeDate2,
                    title: rest,
                    color: color
                });

                maybeDate2 = new Date();
                if (!minDate || date1 < minDate) minDate = date1;
                if (!maxDate || maybeDate2 > maxDate) maxDate = maybeDate2;
            }
        });
        if (minDate && maxDate) {
            const startDate = new Date(minDate);
            const endDate = new Date(maxDate)
            let deltaDate = Math.abs(endDate-startDate) || 1000;
            this.timeline.range.start.date = new Date(minDate.getTime()-deltaDate*0.2);
            this.timeline.range.end.date = new Date(maxDate.getTime()+deltaDate*0.2);
        }
        this.timeline.calculateGridInformation();
        this.timeline.draw();

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