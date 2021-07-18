const isValidDate = (dateTime) =>
  dateTime && !Number.isNaN(Date.parse(dateTime));

export default isValidDate;
