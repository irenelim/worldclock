import React, { useEffect, useRef } from 'react';
import { select, axisBottom, axisLeft, axisRight, scaleLinear, scaleBand } from "d3";
import useResizeObserver from "../../shared/useResizeObserver";

const barColor = ["blue", "steelblue"];

function BarChart({currentTime}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    // const [tooltip, setTooltip] = useState(null);

    useEffect(()=>{
        const data = [{xlabel:"hr", value: currentTime ? parseInt(currentTime.split(/:/)[0]) : 0}, 
         {xlabel:"min", value:currentTime ? parseInt(currentTime.split(/:/)[1]) : 0}];

        const svg = select(svgRef.current);
        const { width, height } =
            dimensions || wrapperRef.current.getBoundingClientRect(); 

        const xScale = scaleBand()
            .domain(data.map((entry, index) => index))
            .range([0, width])
            .padding(0.5);

        const yScaleHr = scaleLinear()
            .domain([0, 24])
            .range([height, 0]);

        const yScaleMin = scaleLinear()
            .domain([0, 60])
            .range([height, 0]);

        const xAxis = axisBottom(xScale)
                        .ticks(data.length)
                        .tickFormat(d=>`${data[d].xlabel} ${data[d].value}`);
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
            .data(data.map(item=>item.value))
            .join("rect")
            .attr("class", "bar")
            .attr("fill", (value, index) => barColor[index])
            .style("transform", "scale(1, -1")
            .attr("x", (value, index) => xScale(index))
            .attr("y", -height)
            .attr("width", xScale.bandwidth())
            // .on("click", (value, index) => {
            // })            
            .transition()
            .attr("height", (value, index) => 
                height - ( index===0 ? yScaleHr(value) : yScaleMin(value) )
            );  

        svg
            .selectAll('.tooltip')
            .data(data.map(item=>item.value))
            .join("text")
            .attr("class", "tooltip")
            .text((value, index) => value)
            .attr("x", (value, index) => xScale(index) + (xScale.bandwidth()/2) )
            .attr("text-anchor", "middle")
            .attr("y", (value, index) => (index===0 ? yScaleHr(value) : yScaleMin(value)) - 10 );

    }, [currentTime, dimensions]);

    return (
        <div ref={wrapperRef} className="gutterBottom">
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis-hr" />
                <g className="y-axis-min" />
            </svg>
        </div>  
    );    
}

export default BarChart;