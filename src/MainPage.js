import { useEffect, useState } from 'react';
import DailyMessages from './DailyMessages';
import {
  formatFileMessageData,
  getMessageCountPerUser,
  getRacingBarData,
} from './helpers/dataFormatters';
import ImportFileSteps from './ImportFileSteps';
import SimpleBar from './SimpleBar';
import WordCloud from './WordCloud';
import RaceBarChartContainer from './RaceBarChartContainer';

const MainPage = () => {
  const [fileData, setFileData] = useState(null);
  const [userMessages, setUserMessages] = useState(null);
  const [systemMessages, setSystemMessages] = useState(null);
  const [userNames, setUserNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOverview, setChatOverview] = useState({
    chatName: '',
    totalMessageCount: 0,
    userCount: 0,
  });

  const readFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const overview = {
      ...chatOverview,
      chatName: file.name
        .replace('WhatsApp Chat with', '')
        .replace('.txt', '')
        .trim(),
    };
    setChatOverview(overview);
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      setFileData(contents);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setIsLoading(true);
    if (fileData) {
      const formattedData = formatFileMessageData(fileData);
      setUserMessages(formattedData.userMessages);
      setSystemMessages(formattedData.systemMessages);
      setUserNames(formattedData.userNames);
      setChatOverview({
        ...chatOverview,
        totalMessageCount: formattedData.userMessages.length,
        userCount: formattedData.userNames.length,
      });
    }
    setIsLoading(false);
  }, [fileData]);

  return (
    <>
      {fileData === null ? (
        <ImportFileSteps />
      ) : (
        <div className="w-full h-full flex flex-col gap-6">
          <div className=" border-b border-purple-200 pb-4 flex items-center">
            <div className="flex-1 flex flex-col text-left">
              <div className="flex gap-1 items-center">
                Total Messages
                <div className="text-purple-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-heading tracking-wider text-textPrimary">
                {chatOverview.totalMessageCount}
              </div>
              <div className="text-xs">JUL 2020 - MAR 2020</div>
            </div>
            <div className="flex-1 text-center font-heading text-3xl text-textPrimary">
              {chatOverview.chatName}
            </div>
            <div className="flex-1 text-textPrimary">
              <div className="flex flex-col items-end">
                <div className="text-purple-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-heading text-right">
                  {chatOverview.userCount} Users
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="flex flex-col card-bg h-96 w-full">
              <div className="flex">
                <div className="flex-1 text-left font-heading text-2xl">
                  TOTAL MESSAGES PER USER
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-right font-heading text-2xl">
                  AP 230 Messages
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-grow">
                {userMessages && userNames && (
                  <SimpleBar
                    userNames={userNames}
                    userMessageCount={getMessageCountPerUser(
                      userMessages,
                      userNames
                    )}
                  />
                )}
              </div>
            </div>
            <div className="card-bg  h-96 w-full">
              {userMessages && userNames && (
                <WordCloud allMsgs={userMessages} userNames={userNames} />
              )}
            </div>
            {/* <div className="card-bg  h-96 w-full">
              {userMessages && userNames && (
                <DailyMessages
                  allMessages={userMessages}
                  userNames={userNames}
                />
              )}
            </div> */}
            {/* <div className="card-bg  h-96 w-full">
              {userMessages && userNames && (
                <RaceBarChartContainer
                  userDayWiseMessageCount={getRacingBarData(userMessages)}
                  allUsers={userNames}
                />
              )}
            </div> */}
          </div>
        </div>
      )}

      <footer className="fixed bottom-5 right-5">
        {/* hack for styling browse files button */}
        <label
          className="rounded-full bg-body h-16 w-32 text-purple-800 hover:bg-white
  flex justify-center items-center border-white border"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
              clipRule="evenodd"
            />
            <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
          </svg>
          Select File
          <input type="file" onChange={readFile} className="hidden" />
        </label>
      </footer>
    </>
  );
};

export default MainPage;
