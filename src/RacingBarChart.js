import React, { useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, max } from 'd3';
// import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data }) {
  const svgRef = useRef();

  // will be called initially and on every data change
  useEffect(() => {
    const dimensions = {
      height: 600,
      width: 500,
    };
    const svg = select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
    if (!dimensions) return;

    // sorting the data
    data.sort((a, b) => b.value - a.value);

    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, dimensions.height]); // [0, 200]

    const xScale = scaleLinear()
      .domain([0, max(data, (entry) => entry.value)]) // [0, 65 (example)]
      .range([0, dimensions.width]); // [0, 400 (example)]

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data, (entry) => entry.name)
      .join((enter) =>
        enter.append('rect').attr('y', (entry, index) => yScale(index))
      )
      .attr('fill', (entry) => entry.color)
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .transition()
      .attr('width', (entry) => xScale(entry.value))
      .attr('y', (entry, index) => yScale(index));

    // draw the labels
    svg
      .selectAll('.label')
      .data(data, (entry) => entry.name)
      .join((enter) =>
        enter
          .append('text')
          .attr(
            'y',
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
          )
      )
      .text((entry) => `${entry.name} (${entry.value} messages)`)
      .attr('class', 'label')
      .attr('x', 10)
      .transition()
      .attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
  }, [data]);

  return <svg ref={svgRef} />;
}

export default RacingBarChart;
