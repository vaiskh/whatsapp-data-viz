import { useEffect, useState } from 'react';
import { ThreeDots, Puff } from 'svg-loaders-react';
import ImportFileSteps from './ImportFileSteps';
import SimpleBar from './SimpleBar';
import WordCloud from './WordCloud';
import ChatOverview from './ChatOverview';
import WorkerBuilder from './worker-builder';
import Worker from './workers/dataFormatter-worker';

const webWorkerInstance = new WorkerBuilder(Worker);

const MainPage = () => {
  const [formattedData, setFormattedData] = useState({ fileSelected: false });
  useEffect(() => {
    webWorkerInstance.onmessage = (message) => {
      const { formattedMessages, overview } = message.data;
      setFormattedData({
        ...formattedMessages,
        chatOverview: {
          ...overview,
          totalMessageCount: formattedMessages.userMessages.length,
          userCount: formattedMessages.userNames.length,
        },
        fileSelected: true,
        isLoading: false,
      });
    };
  }, []);

  const readFile = (event) => {
    setFormattedData({ fileSelected: true, isLoading: true });
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const overview = {
      chatName: file.name
        .replace('WhatsApp Chat with', '')
        .replace('.txt', '')
        .trim(),
    };
    const reader = new FileReader();
    reader.onload = async function (e) {
      const contents = e.target.result;
      if (webWorkerInstance) {
        webWorkerInstance.postMessage({ contents, overview });
      }
    };
    reader.readAsText(file);
  };

  return formattedData.fileSelected === false ? (
    <ImportFileSteps importChat={readFile} />
  ) : (
    <>
      <div className="w-full h-full flex flex-col gap-6 p-5 font-content">
        <ChatOverview
          allMessages={formattedData.userMessages || []}
          chatOverview={formattedData.chatOverview || {}}
          isLoading={formattedData.isLoading}
        />
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col card-bg h-96 w-full">
            <div className="flex p-2 sm:p-4 text-md sm:text-xl">
              <div className="flex-1 text-left font-heading">
                TOTAL MESSAGES PER USER
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline text-purple-800"
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
              <div className="flex-1 text-right font-heading">
                {formattedData.isLoading ? (
                  <div className="flex justify-end">
                    <ThreeDots width="20" />
                  </div>
                ) : (
                  <>
                    <span>{`${formattedData.msgPerUserCount[0].userName} - ${formattedData.msgPerUserCount[0].count} Messages`}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline text-purple-800"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </div>
            </div>

            <div className="flex-grow">
              {formattedData.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Puff />
                </div>
              ) : (
                <SimpleBar userMessageCount={formattedData.msgPerUserCount} />
              )}
            </div>
          </div>
          <div className="card-bg  h-96 w-full">
            {formattedData.isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Puff />
              </div>
            ) : (
              <WordCloud
                key={formattedData.userMessages}
                wordFreqPerUser={formattedData.wordFreqPerUser}
                userNames={formattedData.userNames}
                isLoading={formattedData.isLoading}
              />
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

      <footer className="fixed bottom-5 right-5 font-content">
        {/* hack for styling browse files button */}
        <label
          className="rounded-full bg-white h-10 sm:h-12 cursor-pointer w-32 text-purple-800 hover:bg-gray-200
                  flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 sm:h-10 sm:w-10"
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
          <span className="text-sm sm:text-md text-black">Select File</span>
          <input type="file" onChange={readFile} className="hidden" />
        </label>
      </footer>
    </>
  );
};

export default MainPage;
