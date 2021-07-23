import { COMMON_WORDS, STOP_WORDS, SYSTEM_MSG_INDICATORS } from '../constants';

const parseMessage = (msg) => {
  const messageParseRegex = new RegExp(
    /((?:3[01]|[21][0-9]|(?:[1-9]|0[1-9]))\/(?:3[01]|[21][0-9]|(?:[1-9]|0[1-9]))\/(?:[1-9][0-9]), (?:1[012]|[1-9]):(?:[0-5][0-9])(?: ?)(?:am|pm|AM|PM)) - (?:(?:(.*?): (.*))|(.*))/
  );

  const regexMatch = msg.match(messageParseRegex);
  if (regexMatch) {
    const group1 = regexMatch[1];
    const group2 = regexMatch[2];
    const group3 = regexMatch[3];
    const group4 = regexMatch[4];
    if (group1 && group2) {
      // to filter out special cases where the system message might have a :
      if (
        SYSTEM_MSG_INDICATORS.some((indicator) =>
          regexMatch[0].includes(indicator)
        )
      ) {
        return null;
      }
      // user message
      return {
        dateTime: group1,
        user: group2,
        text: group3,
        type: 'User Message',
      };
    }
    // system message
    return {
      dateTime: group1,
      text: group4,
      type: 'Sys Message',
    };
  }
  return {
    text: msg,
    type: 'MultiLine Message',
  };
};

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
/**
 * Formats raw file whatsapp chat log file data
 * @param {string} allMessages Whatsapp chat log parsed string
 * @return {Object<any>} Formatted Message Data
 */
const formatFileData = (allMessages) => {
  const userMessages = [];
  const systemMessages = [];
  const mediaMessages = [];
  const userNames = [];
  let msgPerUserCount = [];
  allMessages.split('\n').forEach((msg) => {
    const parsedMsg = parseMessage(msg);
    if (parsedMsg) {
      if (parsedMsg.type === 'User Message') {
        if (!userNames.find((u) => u === parsedMsg.user)) {
          userNames.push(parsedMsg.user);
        }
        // update msg count per user
        const userMsgCount = msgPerUserCount.find(
          (u) => u.userName === parsedMsg.user
        );
        if (userMsgCount) {
          // user already entered, increment count
          userMsgCount.count += 1;
        } else {
          msgPerUserCount.push({
            userName: parsedMsg.user,
            count: 1,
          });
        }
        if (
          parsedMsg.text &&
          parsedMsg.text.toLowerCase().trim() === '<media omitted>'
        ) {
          mediaMessages.push(parsedMsg);
        } else {
          userMessages.push(parsedMsg);
        }
      } else if (parsedMsg.type === 'Sys Message') {
        systemMessages.push(parsedMsg);
      } else {
        const lastUserMsgPos = userMessages.length - 1;
        const text = `${userMessages[lastUserMsgPos].text} ${parsedMsg.text}`;
        userMessages[lastUserMsgPos] = {
          ...userMessages[lastUserMsgPos],
          text,
        };
      }
    }
  });
  msgPerUserCount = msgPerUserCount.sort((a, b) => b.count - a.count);
  return { userMessages, systemMessages, userNames, msgPerUserCount };
};

export { getRacingBarData, formatFileData, getWrdFrequency };
