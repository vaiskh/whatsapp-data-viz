import { useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { COMMON_WORDS, STOP_WORDS } from './constants';

const dummyWords = [
  {
    text: 'told',
    value: 64,
  },
  {
    text: 'mistake',
    value: 11,
  },
  {
    text: 'thought',
    value: 16,
  },
  {
    text: 'bad',
    value: 17,
  },
];

function getWordCloudComponent(words) {
  const options = {
    colors: ['#7209B7', '#560BAD', '#480CA8', '#3A0CA3', '#3A0CA3', '#4361EE'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'impact',
    fontSizes: [10, 70],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 0.5,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'rectangular',
    transitionDuration: 1000,
  };
  return <ReactWordcloud words={words} options={options} />;
}

const filterCommonWords = (words) =>
  words.filter(
    (word) =>
      !COMMON_WORDS.find((commonWord) => commonWord === word.trim()) &&
      !STOP_WORDS.find((stopWord) => stopWord === word.trim())
  );

const filterMessages = (allMessages, selectedUser) => {
  let messages = [];
  if (selectedUser === '') {
    messages = allMessages.map((msg) => msg.text.trim());
  } else {
    allMessages.forEach((msg) => {
      if (msg.user === selectedUser && msg.text) {
        messages.push(msg.text.trim());
      }
    });
  }
  return messages;
};

const getWordFrequency = (messageStrings) => {
  if (messageStrings) {
    let str = messageStrings.join(' ');
    str = str.toLowerCase();
    let allWords = str.split(' ');
    allWords = filterCommonWords(allWords);
    let returnObj = [];
    allWords.forEach((word) => {
      const trimmedWord = word.trim();
      const uniqueWord = returnObj.find(
        (uniqWord) => uniqWord.text === trimmedWord
      );
      if (uniqueWord) {
        uniqueWord.value += 1;
      } else {
        returnObj.push({
          text: trimmedWord,
          value: 1,
        });
      }
    });
    returnObj = returnObj.filter((el) => el.text !== ''); // remove empty
    return returnObj.sort((a, b) => b.value - a.value).slice(0, 2000);
  }
  return dummyWords;
};

const WordCloud = ({ allMsgs, userNames }) => {
  console.log(userNames);
  const [selectedUser, setSelectedUser] = useState('');
  return (
    <div>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">All Members</option>
        {userNames.map((userName) => (
          <option value={userName}>{userName}</option>
        ))}
      </select>
      {getWordCloudComponent(
        getWordFrequency(filterMessages(allMsgs, selectedUser))
      )}
    </div>
  );
};

export default WordCloud;
