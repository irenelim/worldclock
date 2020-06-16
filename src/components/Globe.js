import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator } from "d3";
import useResizeObserver from "../shared/useResizeObserver";
import { getCurrentTime } from '../shared/functions';

function Globe({ data, property, utcCurrentTime }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
      .join("path")
      .on("click", feature => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
        .attr("fill", '#7cba68')
      .attr("d", feature => pathGenerator(feature));

    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        feature =>
          feature &&
          `<${feature.properties.name}>` 
      )
      .attr("x", '50%')
      .attr("y", `${height/2-18}px`);    
    svg
      .selectAll(".labelTime")
      .data([selectedCountry])
      .join("text")
      .attr("class", "labelTime")
      .text(
        feature =>
          feature &&
          `Current Time: ${utcCurrentTime.length>0 ? getCurrentTime(
              utcCurrentTime.slice(-6, -1), 
              feature.properties[property[1]].slice(3)) : ''}` 
      )
      .attr("x", '50%')
      .attr("y", `${height/2}px`);    
    svg
      .selectAll(".label1")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label1")
      .text(
        feature =>
          feature && 
            `Time Zone: ${feature.properties[property[1]]}`
      )
      .attr("x", '50%')
      .attr("y", `${height/2+18}px`);
    svg
      .selectAll(".label2")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label2")
      .text(
        feature =>
          feature && 
            `With DST: ${feature.properties[property[2]]===1?'Yes': 'No'}`
      )
      .attr("x", '50%')
      .attr("y", `${(height/2)+(18*2)}px`);
  }, [data, dimensions, property, selectedCountry, utcCurrentTime]);

  return (
    <>
    <h2>World Map Clock</h2>
    
      <div ref={wrapperRef} className="gutterBottom">
        <svg ref={svgRef}></svg>
      </div>
    
    </>
  );
}

export default Globe;
