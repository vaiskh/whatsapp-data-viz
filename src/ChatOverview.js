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
    <div className=" border-b border-purple-200 pb-4 flex items-center">
      <div className="flex-1 flex flex-col text-left">
        <div className="flex gap-1 items-center text-xxs sm:text-xl">
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
        <div className="text-xl sm:text-3xl font-heading tracking-wider text-textPrimary">
          {isLoading ? 'Loading...' : chatOverview.totalMessageCount}
        </div>
        <div className="text-xxs sm:text-xs">{`${startDate} - ${endDate}`}</div>
      </div>
      <div className="flex-1 text-center font-heading text-xl sm:text-3xl text-textPrimary">
        {isLoading ? 'Loading..' : chatOverview.chatName}
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
          <div className="text-xl sm:text-2xl font-heading text-right">
            {isLoading ? 'Loading...' : chatOverview.userCount} Users
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverview;
