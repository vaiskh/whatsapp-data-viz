import { COMMON_WORDS, STOP_WORDS, SYSTEM_MSG_INDICATORS } from '../constants';

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

const getWrdFrequency = (allMessages, selectedUser) => {
  const eachWordCount = {};
  allMessages.forEach((msg) => {
    if (selectedUser === '' || selectedUser === msg.user) {
      msg.text
        .trim()
        .split(' ')
        .forEach((word) => {
          if (
            !COMMON_WORDS.find((commonWord) => commonWord === word.trim()) &&
            !STOP_WORDS.find((stopWord) => stopWord === word.trim())
          ) {
            // let currentWord = eachWordCount[word.trim()];
            if (eachWordCount[word.trim()]) {
              eachWordCount[word.trim()] += 1;
            } else if (word !== '') {
              eachWordCount[word.trim()] = 1;
            }
          }
        });
    }
  });
  return eachWordCount;
};

export { getRacingBarData, getWrdFrequency };
