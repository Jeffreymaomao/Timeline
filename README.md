# Timeline

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

## License

**Timeline** is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.