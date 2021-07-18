import { SYSTEM_MSG_INDICATORS } from '../constants';
import isValidDate from './utils';

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

/**
 * Formats raw file whatsapp chat log file data
 * @param {string} fileData Whatsapp chat log parsed string
 * @return {Object<any>} Formatted Message Data
 */
const formatFileMessageData = (fileData) => {
  const systemMessages = [];
  const userMessages = [];
  const userNames = [];
  const mediaMessages = [];

  const lines = fileData.split('\n');

  // if the message is multi line then the partcular line in the rawData will only contain the message, no username or datetime
  const messageData = [];
  lines.forEach((msg) => {
    if (msg && isValidDate(msg.split('-')[0])) {
      messageData.push(msg);
    } else {
      const latestMessageArrayPosition = messageData.length - 1;
      messageData[
        latestMessageArrayPosition
      ] = `${messageData[latestMessageArrayPosition]} ${msg}`;
    }
  });

  messageData.forEach((msg) => {
    if (SYSTEM_MSG_INDICATORS.some((indicator) => msg.includes(indicator))) {
      systemMessages.push({ type: 'System Msg', text: msg });
    } else if (msg) {
      const [dateTime, textAndUser] = msg.split('M - ');
      const [user, text] = textAndUser ? textAndUser.split(':') : ['', ''];
      // push userName to list of alluserNames
      if (!userNames.find((u) => u === user)) {
        userNames.push(user);
      }
      const type = 'User Message';
      if (text && text.includes('<Media omitted>')) {
        mediaMessages.push({
          type,
          user,
          text,
          dateTime: `${dateTime.trim()}M`, // M of AM or PM is split out so re append
        });
      } else {
        userMessages.push({
          type,
          user,
          text,
          dateTime: `${dateTime.trim()}M`, // M of AM or PM is split out so re append
        });
      }
    }
  });
  return { userMessages, systemMessages, userNames };
};

const getMessageCountPerUser = (userMessages, userNames) =>
  userNames.map((userName) => ({
    count: userMessages.filter((msg) => msg.user && msg.user === userName)
      .length,
    userName,
  }));

export { getRacingBarData, formatFileMessageData, getMessageCountPerUser };
