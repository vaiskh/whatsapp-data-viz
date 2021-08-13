import { useEffect, useRef } from 'react';
import { axisBottom, axisLeft, max, scaleBand, scaleLinear, select } from 'd3';
import PropTypes from 'prop-types';
import useResizeObserver from './hooks/useResizeObserver';

const SimpleBar = ({ userMessageCount }) => {
  const userNames = userMessageCount.map((each) => each.userName);
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

    // change tick line to dotted line
    svg.selectAll('g.tick').selectAll('line').style('stroke-dasharray', '5,5');
    // remove x axis line
    svg.selectAll('path.domain').remove();

    // to get range of colors for each bar
    const myColor = scaleLinear()
      .domain([1, y.bandwidth()])
      // .range(['#560BAD', '#4361EE']);
      .range(['#BBFDCE', '#2B44FF']);

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
  }, [userNames, userMessageCount, dimensions]);

  return (
    <div ref={graphWrapper} className="graph-wrapper">
      <svg ref={svgRef} />
    </div>
  );
};

SimpleBar.propTypes = {
  userMessageCount: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      userName: PropTypes.string,
    })
  ).isRequired,
};

export default SimpleBar;
