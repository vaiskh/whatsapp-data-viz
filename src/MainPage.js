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
  //   {/* <div className="card-bg  h-96 w-full">
  //   {userMessages && userNames && (
  //     <DailyMessages
  //       allMessages={userMessages}
  //       userNames={userNames}
  //     />
  //   )}
  // </div> */}
  //   {/* <div className="card-bg  h-96 w-full">
  //   {userMessages && userNames && (
  //     <RaceBarChartContainer
  //       userDayWiseMessageCount={getRacingBarData(userMessages)}
  //       allUsers={userNames}
  //     />
  //   )}
  // </div> */}

  return formattedData.fileSelected === false ? (
    <ImportFileSteps importChat={readFile} />
  ) : (
    <>
      <div className="bg-dark p-7 font-content" style={{ minHeight: '100vh' }}>
        <ChatOverview
          allMessages={formattedData.userMessages || []}
          chatOverview={formattedData.chatOverview || {}}
          isLoading={formattedData.isLoading}
        />
        <div className="flex flex-wrap pt-14 gap-14">
          <div className="bg-white h-96 w-full md:w-80 custom-border flex-grow">
            <div
              className="flex py-1 px-3 items-center justify-between"
              style={{ height: '10%' }}
            >
              <div className="text-xs sm:text-sm text-dark font-bold flex-shrink">
                Total messages per user
              </div>
              <div className="text-xs text-dark flex items-center font-bold text-right flex-none">
                Highest :{' '}
                {formattedData.isLoading ? (
                  <ThreeDots
                    width="20"
                    stroke="#000"
                    fill="#000"
                    color="#000"
                  />
                ) : (
                  <span>{`${formattedData.msgPerUserCount[0].userName} - ${formattedData.msgPerUserCount[0].count}`}</span>
                )}
              </div>
            </div>
            <div style={{ height: '90%' }}>
              {formattedData.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Puff stroke="#000" />
                </div>
              ) : (
                <SimpleBar userMessageCount={formattedData.msgPerUserCount} />
              )}
            </div>
          </div>
          <div className="bg-white h-96 w-full md:w-80 custom-border flex-grow">
            {formattedData.isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Puff stroke="#000" />
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
        </div>
      </div>
      <footer className="fixed bottom-5 right-5 font-content">
        {/* hack for styling browse files button */}

        <label
          className="font-bold text-white text-xs drop-shadow-2xl
      bg-dark px-3 py-2 rounded-3xl border-2 border-primary cursor-pointer
      "
        >
          <span>IMPORT CHAT</span>
          <input type="file" onChange={readFile} className="hidden" />
        </label>
      </footer>
    </>
  );
};

export default MainPage;
