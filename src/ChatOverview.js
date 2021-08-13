import { ThreeDots } from 'svg-loaders-react';
import cardImage from './assets/images/card.png';

const checkIfDDMMFormat = (dateString) => {
  if (dateString && Number(dateString.split('/')[0]) > 12) {
    return true;
  }
  return false;
};

const parseDate = (date, isDDMMFormat) => {
  let dateString = date;
  if (isDDMMFormat) {
    const dateParts = dateString.split('/');
    const dayPart = dateParts[0];
    const monthPart = dateParts[1];
    const restOfDate = dateParts[2];

    dateString = `${monthPart}/${dayPart}/${restOfDate}`;
  }
  return new Date(dateString);
};

const ChatOverview = ({ isLoading, chatOverview, allMessages }) => {
  const isDDMMDateFormat = allMessages.some((msg) =>
    checkIfDDMMFormat(msg.dateTime)
  );
  const startDate = allMessages.length
    ? parseDate(allMessages[0].dateTime, isDDMMDateFormat).toDateString()
    : '';
  const endDate = allMessages.length
    ? parseDate(allMessages.pop().dateTime, isDDMMDateFormat).toDateString()
    : '';
  return (
    <div className="bg-primary text-black w-full  md:w-1/2 rounded-lg flex">
      <div className="w-2/3">
        <div className="p-4">
          <div className="font-black uppercase py-3">
            {isLoading ? <ThreeDots width="20" /> : chatOverview.chatName}
          </div>
          <div className="flex gap-2">
            <div className="pill p-2 text-center text-accent200">
              <div className="text-xs font-normal">Total Messages</div>
              <div className="text-sm font-bold">
                {isLoading ? (
                  <ThreeDots
                    width="20"
                    className="inline"
                    stroke="#000"
                    fill="#000"
                    color="#000"
                  />
                ) : (
                  chatOverview.totalMessageCount
                )}
              </div>
            </div>
            <div className="pill p-2 text-center text-accent200">
              <div className="text-xs font-normal">User Count</div>
              <div className="text-sm font-bold">
                {isLoading ? (
                  <ThreeDots
                    width="20"
                    className="inline"
                    stroke="#000"
                    fill="#000"
                    color="#000"
                  />
                ) : (
                  chatOverview.userCount
                )}{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start" style={{ minWidth: '80px' }}>
        <img
          src={cardImage}
          className="object-cover sm:object-fit h-full float-right"
          alt="Space Girl"
        />
      </div>
    </div>
  );
};

export default ChatOverview;
