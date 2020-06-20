import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, zoom, zoomTransform } from "d3";
import useResizeObserver from "../shared/useResizeObserver";
import { getCurrentTime, randomColor } from '../shared/functions';
import { visitedCountry } from '../data/mydata';

function Globe({ data, property, utcCurrentTime }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentZoomState, setCurrentZoomState] = useState(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);    

    svg
      .selectAll(".country")
      .data(data.features)
      .join(enter =>
        enter.append("path")
          .attr("fill", feature => (visitedCountry.indexOf(feature.properties.name) > -1 ?  randomColor() : '#EEF1F8'))
      )
      .on("click", feature => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
        svg.attr('transform', selectedCountry === feature ? null : currentZoomState);
      })
      .attr("class", "country")
      .transition()        
      .attr("d", feature => pathGenerator(feature));

    const zoomBehavior = zoom()
      .scaleExtent([0.8, 5])
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
    
  }, [data, dimensions, property, selectedCountry, utcCurrentTime, currentZoomState]);

  return (
    <>
    <h2>World Map Clock</h2>
    <small>click on country to show time info; click again on the country to zoom out map.</small>
      <div ref={wrapperRef} className="gutterBottom">
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
