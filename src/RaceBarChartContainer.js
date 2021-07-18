import { useState } from 'react';
import { interval, Observable, timer } from 'rxjs';
import RacingBarChart from './RacingBarChart';

const getLastNDaysMessageCounts = (allDaysMsgCount, n) => {
  const lastIndex = allDaysMsgCount.length;
  const startIndex = lastIndex - n > 0 ? lastIndex - n : 0;
  return allDaysMsgCount.slice(startIndex, lastIndex);
};

function doAdelay() {
  setTimeout(() => true, 30000);
}
const RaceBarChartContainer = ({ userDayWiseMessageCount, allUsers }) => {
  console.log(userDayWiseMessageCount);
  const [start, setStart] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentDay, setCurrentDay] = useState('');
  const [data, setData] = useState([]);
  let sub;

  const requiredDaywiseMessages = getLastNDaysMessageCounts(
    userDayWiseMessageCount,
    30
  );
  // userDaily Message will contain the number of messages send by each user for last n days
  // model
  // [{
  //     day: "01/13/2020",
  //     users:[ {name: "ron", messageCount: "500"}, {name: "tammy1", messageCount: "100"}, {name: "tammy2", messageCount: "200"}]
  // },{
  //     day: "01/14/2020",
  //     users:[ {name: "ron", messageCount: "400"}, {name: "tammy1", messageCount: "200"}, {name: "tammy2", messageCount: "50"}]
  // },{
  //     day: "01/15/2020",
  //     users:[ {name: "ron", messageCount: "600"}, {name: "tammy1", messageCount: "10"}, {name: "tammy2", messageCount: "20"}]
  // }]

  const getFormattedData = (index) =>
    allUsers.map((user) => {
      const userDayWiseObj = requiredDaywiseMessages[index].users.find(
        (u) => u.name === user
      );
      return {
        name: user,
        value: userDayWiseObj ? userDayWiseObj.messageCount : 0,
        color: '#B5179E',
      };
    });

  function delayedFuncCall(t) {
    setData(getFormattedData(t));
    setCurrentDay(requiredDaywiseMessages[t].day.toString());
    if (t === requiredDaywiseMessages.length - 1) {
      sub.unsubscribe();
    }
  }

  const startRace = async () => {
    if (start) {
      // pauseRace
    } else {
      setStart(true);

      const source = interval(1000);
      sub = source.subscribe((t) => {
        delayedFuncCall(t);
      });

      // when the race starts get the oldest dates counts and send to chart component
      // wait for a few seconds (TODO: change wait time based on the user selected speed )
    }
  };
  return (
    <div>
      <h3>{currentDay}</h3>
      <RacingBarChart data={data} />
      <button type="button" onClick={() => startRace()}>
        {start ? 'Stop the race' : 'Start the race!'}
      </button>
    </div>
  );
};

export default RaceBarChartContainer;
