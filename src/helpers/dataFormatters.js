const getRacingBarData = (allMessages) => {
  const returnObj = [];
  const messages = allMessages.filter((msg) => msg.type !== 'System Msg');
  messages.forEach((msg) => {
    const date = new Date(msg.dateTime.split(',')[0]);
    const selectedMsgDateDataObj = returnObj.find(
      (el) => el.day && el.day.getTime() === date.getTime()
    );
    if (selectedMsgDateDataObj) {
      const userObj = selectedMsgDateDataObj.users.find(
        (user) => user.name === msg.user
      );
      if (userObj) {
        userObj.messageCount += 1;
      } else {
        selectedMsgDateDataObj.users.push({ name: msg.user, messageCount: 1 });
      }
    } else {
      returnObj.push({ day: date, users: [] });
    }
  });
  return returnObj;
};

export default getRacingBarData;
