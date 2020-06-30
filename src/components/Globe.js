// https://www.knoyd.com/blog/2017/7/4/traveling-the-world-in-d3-part-3
// https://codepen.io/frontendcharts/pen/EpEgox?editors=0010
import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, geoOrthographic, zoom, zoomTransform } from "d3";
import useResizeObserver from "../shared/useResizeObserver";
import { getCurrentTime, randomColor } from '../shared/functions';
import useAnimationFrame from '../shared/useAnimationFrame';
import { visitedCountry } from '../data/mydata';
// import * as topojson from "topojson";
// import topoData from "../data/geoTopo.json";

function Globe({ data, property, utcCurrentTime }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentZoomState, setCurrentZoomState] = useState(null);
  const [lambda, setLambda] = useState(0);
  const [cancelRotation, setCancelRotation] = useState(false);  

  useAnimationFrame(deltaTime => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setLambda(prevLambda => (prevLambda + deltaTime * 0.01) % 360);
  }, cancelRotation);

  useEffect(() => {
    // const geoJson = topojson.feature(topoData, topoData.objects.ne_110m_admin_0_countries);
    const svg = select(svgRef.current);
    
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

      const projection = geoOrthographic()  //geoMercator()
        // .fitSize([width, height], selectedCountry || data)
        .fitSize([width, height], data)
        // .fitSize([width, height], geoJson)
        .rotate([lambda])
        .precision(100);

    const pathGenerator = geoPath().projection(projection);  

    svg
      .selectAll(".country")
      .data(data.features, feature => feature.properties['iso_a2'])
      .join(enter =>
        enter.append("path")
          .attr("fill", feature => (visitedCountry.indexOf(feature.properties.name) > -1 ?  randomColor() : '#aaa'))
      )
      .on("click", feature => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
        setCancelRotation(selectedCountry === feature ? false : true);
        svg.attr('transform', selectedCountry === feature ? null : currentZoomState);
      })
      .classed("country", true)
      .attr("d", feature => pathGenerator(feature))
      .transition();     

    const zoomBehavior = zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .on("zoom", ()=>{
        const zoomState = zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
        svg.attr('transform', zoomState);
      });

    svg.call(zoomBehavior);
    
  }, [data, dimensions, property, selectedCountry, utcCurrentTime, currentZoomState, lambda]);

  

  return (
    <>
    <h2>World Map Clock</h2>
    <small>click on country to show time info; click again on the country to zoom out map.</small>
      <div ref={wrapperRef} className="gutter">
        <svg ref={svgRef}></svg>
        {selectedCountry && 
          <div className="tooltip">
            <table>
              <thead><tr>
              <th colSpan="2">{selectedCountry.properties.name}</th>
              </tr></thead>
              <tbody>
              <tr>
                <td>Current Time</td>
                <td>{utcCurrentTime.length>0 ? getCurrentTime(
              utcCurrentTime, 
              selectedCountry.properties[property[1]]) : ''}</td>
              </tr>
              <tr>
                <td>Time Zone</td>
                <td>{selectedCountry.properties[property[1]]}</td>
              </tr>
              <tr>
                <td>With DST</td>
                <td>{selectedCountry.properties[property[2]]===1?'Yes': 'No'}</td>
              </tr>
            </tbody>
            </table>
          </div>
        }
      </div>
    
    </>
  );
}

export default Globe;
