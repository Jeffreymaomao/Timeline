function createAndAppendDOM(parent, name, attributes = {}) {
    const parts = name.split(/(?=[#.])/);
    const tag = parts[0]||'div';
    const element = document.createElement(tag);

    parts.forEach(part => {
        if (part.startsWith('.')) {
            element.classList.add(part.slice(1));
        } else if (part.startsWith('#')) {
            element.id = part.slice(1);
        }
    });

    // class 
    if (attributes.class) {
        attributes.class.split(" ").forEach(className => element.classList.add(className));
        delete attributes.class; // delete class in attributes
    }
    // dataset
    if (attributes.dataset) {
        Object.keys(attributes.dataset).forEach(key => element.dataset[key] = attributes.dataset[key]);
        delete attributes.dataset; // delete dataset in attributes
    }
    // other attributes
    Object.keys(attributes).forEach(key => {
        element[key] = attributes[key];
        if (!element[key]) element.setAttribute(key, attributes[key]);
    });

    Object.keys(attributes).forEach(key => { element[key] = attributes[key] });

    if (parent) parent.appendChild(element);
    return element;
}

function createAndAppendElement(parent, tag, attributes = {}) {
    const element = document.createElement(tag);

    // class 
    if (attributes.class) {
        attributes.class.split(" ").forEach(className => element.classList.add(className));
        delete attributes.class; // delete class in attributes
    }
    // dataset
    if (attributes.dataset) {
        Object.keys(attributes.dataset).forEach(key => element.dataset[key] = attributes.dataset[key]);
        delete attributes.dataset; // delete dataset in attributes
    }
    // other attributes
    Object.keys(attributes).forEach(key => {
        element[key] = attributes[key];
        if (!element[key]) element.setAttribute(key, attributes[key]);
    });

    Object.keys(attributes).forEach(key => { element[key] = attributes[key] });

    if (parent) parent.appendChild(element);
    return element;
}

// ----

function formatDate(date, format, utc) {
    // if(!format) format = "yyyy/MM/dd - HH:mm:ss.fff";
    /**
     * Original Code: https://stackoverflow.com/a/14638191/24498411
     */
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};

function _parseFormattedDate(dateString, format) {
    const now = new Date(); // Get current date/time for fallback values
    const formatParts = format.match(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|fff|ff|f|TT|T|tt|t|K)/g);
    const dateParts = dateString.match(/\d{1,4}|AM|PM|Z|[-+]\d{2}:\d{2}/gi);

    // Initialize date components with the current date as fallback
    let year         = now.getFullYear(),
        month        = now.getMonth(),  // Month is 0-indexed
        day          = now.getDate(),
        hours        = now.getHours(),
        minutes      = now.getMinutes(),
        seconds      = now.getSeconds(),
        milliseconds = now.getMilliseconds();

    let isPM = false, timezoneOffset = now.getTimezoneOffset();

    formatParts.forEach((part, index) => {
        switch (part) {
            case "yyyy":
                year = parseInt(dateParts[index], 10);
                break;
            case "yy":
                year = 2000 + parseInt(dateParts[index], 10); // Assuming 21st century
                break;
            case "MM":
            case "M":
                month = parseInt(dateParts[index], 10) - 1; // Month is 0-indexed
                break;
            case "dd":
            case "d":
                day = parseInt(dateParts[index], 10);
                break;
            case "HH":
            case "H":
                hours = parseInt(dateParts[index], 10);
                break;
            case "hh":
            case "h":
                hours = parseInt(dateParts[index], 10);
                break;
            case "mm":
            case "m":
                minutes = parseInt(dateParts[index], 10);
                break;
            case "ss":
            case "s":
                seconds = parseInt(dateParts[index], 10);
                break;
            case "fff":
            case "ff":
            case "f":
                milliseconds = parseInt(dateParts[index], 10) * Math.pow(10, 3 - part.length);
                break;
            case "TT":
            case "T":
            case "tt":
            case "t":
                isPM = /PM/i.test(dateParts[index]);
                break;
            case "K":
                timezoneOffset = dateParts[index] === "Z" ? 0 : parseTimezoneOffset(dateParts[index]);
                break;
        }
    });
    if (isPM && hours < 12) hours += 12; // Convert 12-hour to 24-hour format
    // if (!isPM && hours === 12) hours = 0; // Handle midnight
    // Apply timezone offset
    const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    if (timezoneOffset !== now.getTimezoneOffset()) {
        return new Date(date.getTime() - timezoneOffset * 60 * 1000);
    }
    return date;
}

function parseFormattedDate(dateString, format) {
    const MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
    const MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Function to escape regex special characters
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Parse the format string into tokens
    function parseFormatString(format) {
        const tokens = [];
        let i = 0;
        const len = format.length;
        const formatSpecifiers = [
            'yyyy', 'yy', 'y',
            'MMMM', 'MMM', 'MM', 'M',
            'dddd', 'ddd',
            'dd', 'd',
            'HH', 'H',
            'hh', 'h',
            'mm', 'm',
            'ss', 's',
            'fff', 'ff', 'f',
            'TT', 'T',
            'tt', 't',
            'K'
        ];

        while (i < len) {
            const c = format[i];
            if (c === '\\') {
                // Escaped character
                if (i + 1 < len) {
                    tokens.push({ type: 'literal', value: format[i + 1] });
                    i += 2;
                } else {
                    tokens.push({ type: 'literal', value: '\\' });
                    i++;
                }
            } else {
                // Check if any format specifier matches at this position
                let matched = false;
                // Prioritize longer specifiers first
                const sortedSpecifiers = formatSpecifiers.sort((a, b) => b.length - a.length);
                for (const specifier of sortedSpecifiers) {
                    if (format.startsWith(specifier, i)) {
                        tokens.push({ type: 'specifier', value: specifier });
                        i += specifier.length;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    tokens.push({ type: 'literal', value: c });
                    i++;
                }
            }
        }
        return tokens;
    }

    function getSpecifierPattern(specifier) {
        const patterns = {
            'yyyy': '(?<year>\\d{4})',
            'yy': '(?<year>\\d{2})',
            'y': '(?<year>\\d{1,4})',
            'MMMM': '(?<monthName>[A-Za-z]+)',
            'MMM': '(?<monthName>[A-Za-z]+)',
            'MM': '(?<month>\\d{2})',
            'M': '(?<month>\\d{1,2})',
            'dddd': '(?<dayName>[A-Za-z]+)',
            'ddd': '(?<dayName>[A-Za-z]+)',
            'dd': '(?<day>\\d{2})',
            'd': '(?<day>\\d{1,2})',
            'HH': '(?<hours24>\\d{2})',
            'H': '(?<hours24>\\d{1,2})',
            'hh': '(?<hours12>\\d{2})',
            'h': '(?<hours12>\\d{1,2})',
            'mm': '(?<minutes>\\d{2})',
            'm': '(?<minutes>\\d{1,2})',
            'ss': '(?<seconds>\\d{2})',
            's': '(?<seconds>\\d{1,2})',
            'fff': '(?<milliseconds>\\d{3})',
            'ff': '(?<milliseconds>\\d{2})',
            'f': '(?<milliseconds>\\d{1})',
            'TT': '(?<AMPM>AM|PM)',
            'T': '(?<AMPM>A|P)',
            'tt': '(?<ampm>am|pm)',
            't': '(?<ampm>a|p)',
            'K': '(?<timezone>Z|[+-]\\d{2}:\\d{2})'
        };
        return patterns[specifier];
    }

    // Build the regex pattern from tokens
    function buildRegexPattern(tokens) {
        const patternParts = [];
        const optionalStack = [];

        for (const token of tokens) {
            if (token.value === '[') {
                optionalStack.push([]);
                continue;
            }
            if (token.value === ']') {
                const optionalGroup = optionalStack.pop().join('');
                const wrapped = `(?:${optionalGroup})?`;
                if (optionalStack.length > 0) {
                    optionalStack[optionalStack.length - 1].push(wrapped);
                } else {
                    patternParts.push(wrapped);
                }
                continue;
            }

            let part = '';
            if (token.type === 'literal') {
                part = escapeRegExp(token.value);
            } else if (token.type === 'specifier') {
                const specPattern = getSpecifierPattern(token.value);
                part = specPattern || escapeRegExp(token.value);
            }

            if (optionalStack.length > 0) {
                optionalStack[optionalStack.length - 1].push(part);
            } else {
                patternParts.push(part);
            }
        }

        return '^' + patternParts.join('') + '$';
    }

    const tokens = parseFormatString(format);
    const pattern = buildRegexPattern(tokens);

    // Debug: Uncomment to see the generated regex
    // console.log("Generated Regex:", pattern);

    let regex;
    try {
        regex = new RegExp(pattern, 'i'); // 'i' for case-insensitive matching
    } catch (e) {
        console.error(`Invalid regex pattern: ${pattern}`);
        return null;
    }

    const match = regex.exec(dateString);
    if (!match) {
        // Date string does not match the format
        return null;
    }
    const groups = match.groups;

    // Initialize date components with default values
    const today = new Date();
    let year         = today.getFullYear(),
        month        = today.getMonth(),
        day          = today.getDate(),
        hours        = today.getHours(),
        minutes      = today.getMinutes(),
        seconds      = today.getSeconds(),
        milliseconds = today.getMilliseconds();
    let isPM = false;

    if (groups.year) {
        year = parseInt(groups.year, 10);
        if (groups.year.length === 2) {
            if (year < 50) {
                year += 2000;
            } else {
                year += 1900;
            }
        }
    }
    if (groups.month) {
        month = parseInt(groups.month, 10) - 1;
    }
    if (groups.monthName) {
        const monthName = groups.monthName;
        let m = MMMM.indexOf(monthName);
        if (m === -1) {
            m = MMM.indexOf(monthName);
        }
        if (m !== -1) {
            month = m - 1;
        } else {
            return null;
        }
    }
    if (groups.day) {
        day = parseInt(groups.day, 10);
    }
    if (groups.hours24 !== undefined) {
        hours = parseInt(groups.hours24, 10);
    }
    if (groups.hours12 !== undefined) {
        hours = parseInt(groups.hours12, 10);
    }
    if (groups.minutes) {
        minutes = parseInt(groups.minutes, 10);
    }
    if (groups.seconds) {
        seconds = parseInt(groups.seconds, 10);
    }
    if (groups.milliseconds) {
        const len = groups.milliseconds.length;
        milliseconds = parseInt(groups.milliseconds, 10) * Math.pow(10, 3 - len);
    }
    if (groups.AMPM) {
        isPM = /P/i.test(groups.AMPM);
    }
    if (groups.ampm) {
        isPM = /p/i.test(groups.ampm);
    }
    if (groups.dayName) {
        // Optional validation can be added here
    }
    // Adjust hours for AM/PM
    if (groups.hours12 !== undefined) {
        if (isPM && hours < 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }
    }
    // Handle timezone offset
    let date;
    if (groups.timezone) {
        const timezone = groups.timezone;
        if (timezone.toUpperCase() === 'Z') {
            date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
        } else {
            const matchTz = /([+-])(\d{2}):(\d{2})/.exec(timezone);
            if (matchTz) {
                const sign = matchTz[1] === '+' ? 1 : -1;
                const tzHours = parseInt(matchTz[2], 10);
                const tzMinutes = parseInt(matchTz[3], 10);
                const tzOffset = sign * (tzHours * 60 + tzMinutes);
                date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds) - tzOffset * 60 * 1000);
            } else {
                return null;
            }
        }
    } else {
        date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    }
    return date;
}

// Helper function to parse timezone offset
function parseTimezoneOffset(tz) {
    const match = tz.match(/([-+])(\d{2}):(\d{2})/);
    if (!match) return 0;
    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    return sign * (hours * 60 + minutes);
}

function getTime() {
    const now          = new Date();
    const year         = now.getFullYear();
    const month        = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day          = String(now.getDate()).padStart(2, '0');
    const hours        = String(now.getHours()).padStart(2, '0');
    const minutes      = String(now.getMinutes()).padStart(2, '0');
    const seconds      = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}.${minutes}.${seconds}.${milliseconds}`;
}

function addStyle(style) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.media = "print";
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);
}

function hash(str, type=null) {
    if(typeof str !== 'string') str = `${str}`;
    if(type==='uuid') return uuid_hash(str);
    return default_hash(str);
}

function default_hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //  + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
    const n = chars.length;
    let result = '';
    while (hash > 0) {
        const shift = Math.floor(Math.random() * 1000);
        result = chars[(hash + shift) % n] + result;
        hash = Math.floor(hash / n * 10);
    }
    return result;
}

function uuid_hash(str) {
    let d = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        d = (d << 5) - d + char;
        d |= 0; // Convert to 32-bit integer
    }
    d = Math.abs(d);
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function is2DomsOverlapping(element1, element2) {
    const rect1 = element1.getBoundingClientRect(); 
    const rect2 = element2.getBoundingClientRect(); 
 
    return !( 
        rect1.right < rect2.left ||    // Element 1 is left of Element 2 
        rect1.left > rect2.right ||    // Element 1 is right of Element 2 
        rect1.bottom < rect2.top ||    // Element 1 is above Element 2 
        rect1.top > rect2.bottom       // Element 1 is below Element 2 
    ); 
} 

function is2BoundsOverlapping(rect1, rect2) {
    return !( 
        rect1.right <= rect2.left || 
        rect1.left >= rect2.right || 
        rect1.bottom <= rect2.top || 
        rect1.top >= rect2.bottom
    ); 
}

// https://stackoverflow.com/a/1293163/24498411
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function parseCSV(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        var strMatchedValue;
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            console.log(arrMatches);
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}


export {
    createAndAppendDOM,
    createAndAppendElement,
    is2DomsOverlapping,
    is2BoundsOverlapping,
    formatDate,
    parseFormattedDate,
    getTime,
    addStyle,
    parseCSV,
    hash
}