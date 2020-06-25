This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## plug and play
[miniworldClock](https://worldclock-b7b49.web.app)
<br />
*worldclockapi.com with insecure XMLHttpRequest endpoint*

*fallback using JS Date ISO String*



## install from git
`git clone https://github.com/irenelim/worldclock.git`

`npm install`

`npm start`


### Know the App
#### Functionality
1. clickable map - click on each country to see the currenttime and time info(timezone, dst)
2. Timebar - choose a country to display the currenttime in bar chart.
<br/>

**Note: Current time of each country was calculated base on current utc time getting from *worldclockapi.com / js ISO String* and timezone info from *geojson extended props* data**
<br/>

**Note: Calculation of currentime does not including the DST hour. If the selected country is with DST, currenttime display may not be accurate.**
<br/>

**Note: Some countries have multiple timezones, and only 1 timezone is chosen to represent the tz of each countries.**

***Note: Time info is getting from geojson's properties***

#### How to Use the App
* 2 pages; to navigate between the page, check the link at the buttom of each pages.
* click on any country on the map will zoom in and display you the current time and the time info.
* click again the country will zoomout the map.
* whenever you want to update the current time, click on the ***UTC current time*** at the bottom of the screen.

## Development
build with `react hooks`, `react-router`, `axios`, `d3`

#### get current utc time
`http://worldclockapi.com/api/json/utc/now`
<br/>
fallback: `new Date().toISOString()`

#### time info
[timezone](https://en.wikipedia.org/wiki/List_of_time_zones_by_country)
[DST](https://en.wikipedia.org/wiki/Daylight_saving_time_by_country)


#### get GEOJSON, countries, etc
(geojson)[https://geojson-maps.ash.ms/]

### Reference for d3
- [d3 + react](https://www.youtube.com/playlist?list=PLDZ4p-ENjbiPo4WH7KdHjh_EMI7Ic8b2B)
- [d3 api doc](https://github.com/d3/d3/blob/master/API.md)
- [d3 tutorial](https://github.com/d3/d3/wiki/Tutorials)
- [data visualization d3](https://www.youtube.com/watch?v=_8V5o2UHG0E)

## Next
- [ ] get City/Capital, TopoJson, Tz, show Date and Time
- [X] [+ - zoom and pan for map](https://adamcarter.dev/creating-visualizations-with-d3-and-react/)
- [X] tooltip format for map
- [X] show value for bars
- [X] color random for each countries.
- [X] stop color random on every click
