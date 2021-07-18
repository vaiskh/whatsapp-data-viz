// Data Model required for the daily messages scatter plot
// const data = [{
//     date: "1/07/2021",
//     user: "John_Doe",
//     time: "3:42 PM"
// }]

import {
  axisLeft,
  axisBottom,
  scaleTime,
  select,
  timeParse,
  timeFormat,
} from 'd3';
import { useEffect, useRef, useState } from 'react';
import useResizeObserver from './hooks/useResizeObserver';

// The x-axis of the plot will be days in a week
// The y-axis will be times of each day
// each point in the scatter plot will indicate one message send at the particular time on that particular day

// let data = [{
//     date: "30-Dec-16",
//     time: "Mon Dec 30 2016 16:29:23 GMT+0530 (India Standard Time)",
//     wage: "2"
//   },
//   {
//     date: "27-Jan-17",
//     time: "Mon Jan 27 2017 11:29:23 GMT+0530 (India Standard Time)",
//     wage: "4"
//   },
//   {
//     date: "1-Feb-17",
//     time: "Mon Feb 1 2017 15:29:23 GMT+0530 (India Standard Time)",
//     wage: "6"
//   },
//   {
//     date: "10-Feb-17",
//     time: "Mon Feb 10 2017 21:29:23 GMT+0530 (India Standard Time)",
//     wage: "1"
//   }
// ];

const getUserColor = (allUsers, user) => {
  const colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#ffffff',
    '#000000',
  ];
  const userIndex = allUsers.findIndex((username) => username === user);
  return colors[userIndex];
};

const formatDateTime = (msgs) =>
  msgs.map((msg) => {
    // const parseDate = timeParse("%d-%b-%y");
    const parseDate = timeParse('%m/%d/%y');
    const date = parseDate(msg.date);
    // The y axis will show all times today(0hrs to 23 hrs)
    // get only the time component and add the hours to todays date
    const today = new Date();
    let time = new Date(msg.time);
    today.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
    time = today;
    const { user } = msg;
    return { date, time, user };
  });

const modelMessageData = (messages) => {
  // input format dateTime: "6/16/21, 10:35 PM"
  // required format date: "1-Feb-17",
  // time: "Mon Feb 1 2017 15:29:23 GMT+0530 (India Standard Time)",

  const msgs = messages.filter((msg) => msg.type !== 'System Msg');
  return msgs.map((msg) => {
    const date = msg.dateTime.split(',')[0];
    const time = new Date(msg.dateTime);
    return { date, time, user: msg.user, text: msg.text };
  });
};

const filterThisWeeksMessages = (msgs) => {
  const weekEndDate = new Date(msgs[msgs.length - 1].date);
  const weekStartDate = new Date(
    weekEndDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  return msgs.filter((msg) => new Date(msg.date) > weekStartDate);
};

const sortByDate = (msgs) => msgs.sort((a, b) => a.date - b.date); // Oldest date first

const DailyMessages = ({ allMessages, userNames }) => {
  const svgRef = useRef();
  const graphWrapper = useRef();
  const [selectedUser, setSelectedUser] = useState('');
  const dimensions = useResizeObserver(graphWrapper);

  useEffect(() => {
    if (!dimensions) {
      return;
    }

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    let data =
      selectedUser === ''
        ? allMessages
        : allMessages.filter((msg) => msg.user === selectedUser);
    data = modelMessageData(data);
    // append the svg object to the body of the page
    const svg = select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    svg.selectAll('*').remove();

    data = sortByDate(formatDateTime(data));
    data = filterThisWeeksMessages(data);
    // Add X axis --> it is a date format
    const oldestDate = data[0].date;
    const newestDate = data[data.length - 1].date;

    const mindate = new Date(oldestDate);
    const maxdate = new Date(newestDate);
    const x = scaleTime().domain([mindate, maxdate]).range([0, width]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).ticks(7).tickFormat(timeFormat('%Y-%m-%d')))
      // rotate text dates
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');
    // Add Y Axis - time of the day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const y = scaleTime()
      .domain([startOfDay, endOfDay])
      // .nice(timeDay)
      .range([height, 0]);
    svg
      .append('g')
      .attr('transform', 'translate(0,0)') // positions the axis
      .call(axisLeft(y).ticks(24).tickFormat(timeFormat('%I:%M %p')));
    // Add the line
    // svg.append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", "#69b3a2")
    //     .attr("stroke-width", 0.5)
    //     .attr("d", line()
    //     .x(d => x(d.date))
    //     .y(d => y(d.time))
    //     )
    // Add the points
    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.time))
      .attr('r', 2)
      .style('opacity', 0.5)
      .attr('fill', (d) => getUserColor(userNames, d.user));
    // .attr("stroke-width", 0.1)
  }, [selectedUser, allMessages, userNames, dimensions]);

  return (
    <div className="graph-wrapper">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">All Members</option>
        {userNames.map((userName) => (
          <option value={userName}>{userName}</option>
        ))}
      </select>
      <div className="graph-wrapper" ref={graphWrapper}>
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default DailyMessages;
