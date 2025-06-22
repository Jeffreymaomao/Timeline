<p align='center'>
<a href='https://jeffreymaomao.github.io/Timeline/'>
    <img alt="Timeline Logo" src="assets/icon.png" width='120'>
</a>
<br>
<h1 align='center'>Timeline</h1>
</p>

The **Timeline** is a web-application designed to display a timeline with customizable scales and time intervals. It dynamically adjusts the **time format** based on user action such as mouse movement and scoll actions.

## Features

- **Dynamic Scaling**: Automatically adjusts the timeline’s scale based on the duration (from seconds to years).
- **Customizable Date Format**: Displays time labels with varying levels of detail, depending on the zoom level.
- **Mouse Interaction**: Tracks the mouse position to show precise time values on the timeline.
- **Dark & Light Mode**: Detects and switches between light and dark modes based on the system’s preferences.

## Quick Start

Simply just visit the website: https://jeffreymaomao.github.io/Timeline/

## Usage

### URL Parameters

You can control certain aspects of the timeline by passing parameters through the URL:

| Parameter       | Type         | Description                                                  | Default |
| --------------- | ------------ | ------------------------------------------------------------ | ------- |
| `check_overlap` | `true/false` | Whether to check for overlapping markers. Disabling this reduces computational load. | `false` |
| `fps`           | `integer`    | Sets frames per second for redrawing the timeline. Values up to 60 are sufficient. | `10`    |
| `sep`           | `string`     | Delimiter to separate events in the `events` parameter.      | `|`     |
| `events`        | `string`     | Event data. The first segment specifies the time format (e.g., `hh:mm`), followed by events. |         |

Here is the example for `events` parameters:

- `hh:mm|12:00,event 1|13:30,event 2|16:45,event 2`
- `yyyy_MM_dd_hh:mm|2013_10_10_12:00,event 2|2014_10_10_12:00,event 2`

### Supported Time Format

| Format | Meaning                     | Example Input  |
| ------ | --------------------------- | -------------- |
| `yyyy` | Four-digit year             | `2025`         |
| `yy`   | Two-digit year (00–99)      | `25` → `2025`  |
| `y`    | One to four-digit year      | `5`, `2023`    |
| `MMMM` | Full month name             | `January`      |
| `MMM`  | Abbreviated month name      | `Jan`          |
| `MM`   | Two-digit month (01–12)     | `03`           |
| `M`    | One or two-digit month      | `3`, `12`      |
| `dddd` | Full weekday name           | `Monday`       |
| `ddd`  | Abbreviated weekday name    | `Mon`          |
| `dd`   | Two-digit day (01–31)       | `09`           |
| `d`    | One or two-digit day        | `9`, `31`      |
| `HH`   | 24-hour format (two digits) | `08`, `18`     |
| `H`    | 24-hour format (1–2 digits) | `8`, `18`      |
| `hh`   | 12-hour format (two digits) | `03`, `11`     |
| `h`    | 12-hour format (1–2 digits) | `3`, `11`      |
| `mm`   | Minutes (two digits)        | `07`, `59`     |
| `m`    | Minutes (1–2 digits)        | `7`, `59`      |
| `ss`   | Seconds (two digits)        | `09`, `45`     |
| `s`    | Seconds (1–2 digits)        | `9`, `45`      |
| `fff`  | Milliseconds (three digits) | `001`, `123`   |
| `ff`   | Milliseconds (two digits)   | `12` → `120ms` |
| `f`    | Milliseconds (one digit)    | `1` → `100ms`  |
| `TT`   | `AM` or `PM`                | `AM`           |
| `T`    | `A` or `P`                  | `P`            |
| `tt`   | `am` or `pm`                | `pm`           |
| `t`    | `a` or `p`                  | `a`            |
| `K`    | Timezone (`Z` or ±hh:mm)    | `Z`, `+08:00`  |

## License

**Timeline** is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## Application

### <img src='https://info.arxiv.org/brand/images/brand-logomark-primary-large.jpg' height='50px'> arXiv - visualization of search results

In arXiv, you can search pager by [![](https://img.shields.io/badge/arXiv-search-red.svg)](https://arxiv.org/search) or  [![](https://img.shields.io/badge/arXiv-advance%20search-red.svg)](https://arxiv.org/search), then in the result page, you can display the result in timeline. Copy following script in the results page, it will open a window to show the results on the current arXiv page in timeline.

```js
let timelineURL = 'https://jeffreymaomao.github.io/Timeline/?check_overlap=true&sep=|&events=dd_MMMM_yyyy';
const events = [...document.querySelectorAll('.arxiv-result')].map(arxivResult=>{
    const titleElement = arxivResult.querySelector('.title');
    const dateElement = [...arxivResult.querySelectorAll("*")].find(e=>e.innerText.includes('Submitted'));
    if (!titleElement || !dateElement) return null;
    const title = titleElement.innerText.replace(/\n/g,'').trim();
    const dateString = dateElement.innerText.split(';')[0].split('Submitted')[1].trim().replace(/[, ]+/g, '_');
    return `${dateString}, ${title}`;
}).filter(Boolean);
timelineURL += `|${events.join('|')}`;
window.open(timelineURL)
```