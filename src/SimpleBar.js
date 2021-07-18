import { useEffect, useRef } from 'react';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import PropTypes from 'prop-types';
import useResizeObserver from './hooks/useResizeObserver';

const SimpleBar = ({ userNames, userMessageCount }) => {
  const graphWrapper = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(graphWrapper);
  useEffect(() => {
    if (!dimensions) return; // on the first run the dimensions returned by useResizeObserver hook will be null
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 20, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // clear the current svg contents everyTime the page Rerenders
    select(svgRef.current).selectAll('*').remove();

    // append the svg object to the body of the page
    const svg = select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis - > Message Count
    const x = scaleLinear()
      .domain([0, max(userMessageCount, (d) => d.count)])
      .range([0, width]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).ticks(5).tickSizeInner(-height))
      .attr('color', 'grey')
      .selectAll('text')
      .attr('title', (d) => d.userName);

    svg
      .selectAll('g.tick')
      .select('line') // grab the tick line
      .style('stroke-width', 0.2); // or style directly with attributes or inline styles
    svg
      .selectAll('g.tick')
      .filter((tick) => tick === 0)
      .remove();

    // Y axis -> Each user bar
    const y = scaleBand().domain(userNames).range([0, height]).padding(0.2);
    svg.append('g').call(axisLeft(y).tickSize(0)).select('.domain').remove();
    svg.selectAll('g.tick').selectAll('text').style('color', 'grey');

    // to get range of colors for each bar
    const myColor = scaleLinear()
      .domain([1, y.bandwidth()])
      .range(['#560BAD', '#4361EE']);

    // Bars
    svg
      .selectAll('mybar')
      .data(userMessageCount)
      .join('rect')
      .attr('y', (d) => y(d.userName))
      .attr('height', y.bandwidth())
      .attr('fill', (d, i) => myColor(i))
      .attr('x', () => x(0))
      // no bar at the beginning (vbar will be animated to full length) thus:
      .attr('width', () => x(0));

    // Animation
    svg
      .selectAll('rect')
      .transition()
      .duration(800)
      .attr('width', (d) => x(d.count))
      .delay((d, i) => i * 100);

    svg.selectAll('g.tick').select('text').attr('class', 'simple-bar-label');

    // // X axis
    // const x = scaleBand().range([0, width]).domain(userNames).padding(0.2);
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0,${height})`)
    //   .call(axisBottom(x).tickSize(0))
    //   .attr("color", "grey")
    //   .selectAll("text")
    //   .attr("transform", "translate(-10,0)rotate(-45)")
    //   .style("text-anchor", "end")
    //   .style("color", "white")
    //   .select(".domain")
    //   .remove();
    // // Add Y axis
    // const y = scaleLinear()
    //   .domain([0, max(userMessageCount, (d) => d.count)]) // set te domain maximum to be the largest number of messages
    //   .range([height, 0]);
    // svg
    //   .append("g")
    //   .call(axisLeft(y).tickSizeInner(-width))
    //   .select(".domain")
    //   .remove()
    //   .attr("color", "grey")
    //   .selectAll("text")
    //   .style("color", "white");

    // Bars
    // svg
    //   .selectAll("mybar")
    //   .data(userMessageCount)
    //   .join("rect")
    //   .attr("x", (d) => x(d.userName))
    //   .attr("width", x.bandwidth())
    //   .attr("fill", (d, i) => myColor(i))
    //   // no bar at the beginning thus:
    //   .attr("height", (d) => height - y(0)) // always equal to 0
    //   .attr("y", (d) => y(0));

    // Animation
    // svg
    //   .selectAll("rect")
    //   .transition()
    //   .duration(800)
    //   .attr("y", (d) => y(d.count))
    //   .attr("height", (d) => height - y(d.count))
    //   .delay((d, i) => i * 100);
  }, [userNames, userMessageCount, dimensions]);

  return (
    <div ref={graphWrapper} className="graph-wrapper">
      <svg ref={svgRef} />
    </div>
  );
};

SimpleBar.propTypes = {
  userNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  userMessageCount: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      userName: PropTypes.string,
    })
  ).isRequired,
};

export default SimpleBar;