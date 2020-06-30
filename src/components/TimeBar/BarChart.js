import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, axisRight, scaleLinear, scaleBand } from "d3";
import useResizeObserver from "../../shared/useResizeObserver";

const barColor = ["blue", "steelblue"];

function BarChart({currentTime}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(()=>{
        const data = [{xlabel:"hr", value: currentTime ? parseInt(currentTime.split(/:/)[0]) : 0}, 
         {xlabel:"min", value:currentTime ? parseInt(currentTime.split(/:/)[1]) : 0}];

        const svg = select(svgRef.current);
        const MARGIN = {top: 20, right: 20, bottom: 20, left: 20}

        let { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect(); 

        height = height - MARGIN.top - MARGIN.bottom;
        width = width - MARGIN.left - MARGIN.right;

        const xScale = scaleBand()
            // .domain(data.map((entry, index) => index))
            .domain(data.map((entry) => entry.xlabel))
            .range([0, width])
            .padding(0.5);

        const yScaleHr = scaleLinear()
            .domain([0, 24])
            .range([height, 0]);

        const yScaleMin = scaleLinear()
            .domain([0, 60])
            .range([height, 0]);

        const xAxis = axisBottom(xScale)
                        // .ticks(data.length)
                        .tickSizeOuter(0)
                        // .tickFormat(d=>data[d].xlabel);
        svg
            .select(".x-axis")
            .style("transform", `translateY(${height}px)`)
            .call(xAxis);            
        
        const yAxisLeft = axisLeft(yScaleHr);
        svg
            .select(".y-axis-hr")
            .call(yAxisLeft);

        const yAxisRight = axisRight(yScaleMin);
        svg
            .select(".y-axis-min")
            .style("transform", `translateX(${width}px)`)
            .call(yAxisRight);
        
        svg
            .selectAll(".bar")
            // .data(data.map(item=>item.value))
            .data(data, data => data.xlabel)
            .join("rect")
            .classed("bar", true)
            .attr("fill", (data, index) => barColor[index])
            .style("transform", "scale(1, -1")
            // .attr("x", (value, index) => xScale(index))
            // .attr("y", -height)
            .attr("x", (data, index) => xScale(data.xlabel))
            .attr("y", -height)
            .attr("width", xScale.bandwidth())
            // .on("click", (value, index) => {
            // })            
            .transition()
            .attr("height", (data, index) => 
                height - ( index===0 ? yScaleHr(data.value) : yScaleMin(data.value) )
            );  

        svg
            .selectAll('.tip')
            .data(data, data => data.xlabel)
            .join("text")
            .classed("tip", true)
            .text((data, index) => data.value)
            .attr("x", (data, index) => xScale(data.xlabel) + (xScale.bandwidth()/2) )
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("y", (data, index) => (index===0 ? yScaleHr(data.value) : yScaleMin(data.value)) + (data.value>0 ? 18: 0));

    }, [currentTime, dimensions]);

    return (
        <div ref={wrapperRef} className="gutter">
            <svg ref={svgRef} className="padding">
                <g className="x-axis" />
                <g className="y-axis-hr" />
                <g className="y-axis-min" />
            </svg>
        </div>  
    );    
}

export default BarChart;