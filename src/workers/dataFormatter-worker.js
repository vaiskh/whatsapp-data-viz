export default () => {
  const COMMON_WORDS = [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'I',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'would',
    'there',
    'their',
    'what',
    'so',
    'up',
    'out',
    'if',
    'about',
    'who',
    'get',
    'which',
    'go',
    'me',
    'when',
    'make',
    'can',
    'like',
    'time',
    'no',
    'just',
    'him',
    'know',
    'take',
    'people',
    'into',
    'year',
    'your',
    'good',
    'some',
    'could',
    'them',
    'see',
    'other',
    'than',
    'then',
    'now',
    'look',
    'only',
    'come',
    'its',
    'over',
    'think',
    'also',
    'back',
    'after',
    'use',
    'two',
    'how',
    'our',
    'work',
    'first',
    'well',
    'way',
    'even',
    'new',
    'want',
    'because',
    'any',
    'these',
    'give',
    'day',
    'most',
    'us',
  ];

  const STOP_WORDS = [
    'i',
    'me',
    'my',
    'myself',
    'we',
    'our',
    'ours',
    'ourselves',
    'you',
    "you're",
    "you've",
    "you'll",
    "you'd",
    'your',
    'yours',
    'yourself',
    'yourselves',
    'he',
    'him',
    'his',
    'himself',
    'she',
    "she's",
    'her',
    'hers',
    'herself',
    'it',
    "it's",
    'its',
    'itself',
    'they',
    'them',
    'their',
    'theirs',
    'themselves',
    'what',
    'which',
    'who',
    'whom',
    'this',
    'that',
    "that'll",
    'these',
    'those',
    'am',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'having',
    'do',
    'does',
    'did',
    'doing',
    'a',
    'an',
    'the',
    'and',
    'but',
    'if',
    'or',
    'because',
    'as',
    'until',
    'while',
    'of',
    'at',
    'by',
    'for',
    'with',
    'about',
    'against',
    'between',
    'into',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'to',
    'from',
    'up',
    'down',
    'in',
    'out',
    'on',
    'off',
    'over',
    'under',
    'again',
    'further',
    'then',
    'once',
    'here',
    'there',
    'when',
    'where',
    'why',
    'how',
    'all',
    'any',
    'both',
    'each',
    'few',
    'more',
    'most',
    'other',
    'some',
    'such',
    'no',
    'nor',
    'not',
    'only',
    'own',
    'same',
    'so',
    'than',
    'too',
    'very',
    's',
    't',
    'can',
    'will',
    'just',
    'don',
    "don't",
    'should',
    "should've",
    'now',
    'd',
    'll',
    'm',
    'o',
    're',
    've',
    'y',
    'ain',
    'aren',
    "aren't",
    'couldn',
    "couldn't",
    'didn',
    "didn't",
    'doesn',
    "doesn't",
    'hadn',
    "hadn't",
    'hasn',
    "hasn't",
    'haven',
    "haven't",
    'isn',
    "isn't",
    'ma',
    'mightn',
    "mightn't",
    'mustn',
    "mustn't",
    'needn',
    "needn't",
    'shan',
    "shan't",
    'shouldn',
    "shouldn't",
    'wasn',
    "wasn't",
    'weren',
    "weren't",
    'won',
    "won't",
    'wouldn',
    "wouldn't",
  ];
  const SYSTEM_MSG_INDICATORS = [
    'created group',
    'changed the subject',
    "changed this group's icon",
    'changed the group description',
    'turned on disappearing messages.',
    'turned off disappearing messages',
    "You're now an admin",
    'joined using this',
    "You're no longer an admin",
    "deleted this group's icon",
    ' removed ',
    'left',
    'deleted the group description',
    'admin',
    'Messages and calls are end-to-end encrypted',
    'added',
    'left',
    "changed this group's settings",
    'disappearing messages were turned',
    'your security code',
  ];

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

  const getWordFequencyPerUser = (allMsgs, userNames) => {
    wordFreqSelectOptions = [].concat(userNames);
    wordFreqSelectOptions.push(''); // the select option will include an empty option indicating all memebers
    const wordFreqPerUser = {};
    wordFreqSelectOptions.forEach((user) => {
      let wordFreqObject = getWrdFrequency(allMsgs, user);
      const objEntries = Object.entries(wordFreqObject);
      wordFreqObject = objEntries.sort((a, b) => b[1] - a[1]);
      wordFreqObject = wordFreqObject.slice(0, 400);
      // TODO Find out why using array destructuring syntax in service worker throes error
      wordFreqPerUser[user] = wordFreqObject.map((word) => ({
        text: word[0],
        value: word[1],
      }));
    });
    return wordFreqPerUser;
  };

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
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = (message) => {
    const { contents, overview } = message.data;
    const userMessages = [];
    const systemMessages = [];
    const mediaMessages = [];
    const userNames = [];
    let msgPerUserCount = [];
    contents.split('\n').forEach((msg) => {
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
          const lastUserMsgObj = userMessages[lastUserMsgPos];
          let { text } = lastUserMsgObj;
          const { dateTime, type, user } = lastUserMsgObj;
          text = `${userMessages[lastUserMsgPos].text} ${parsedMsg.text}`;
          userMessages[lastUserMsgPos] = { dateTime, user, text, type };
        }
      }
    });
    msgPerUserCount = msgPerUserCount.sort((a, b) => b.count - a.count);
    wordFreqPerUser = getWordFequencyPerUser(userMessages, userNames);
    formattedMessages = {
      userMessages,
      systemMessages,
      userNames,
      msgPerUserCount,
      wordFreqPerUser,
    };
    postMessage({ formattedMessages, overview });
  };
};
