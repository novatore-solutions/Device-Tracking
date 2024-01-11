const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const relativeTime = require('dayjs/plugin/relativeTime');
const utc = require('dayjs/plugin/utc');
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const defaultUTCFormate = 'YYYY-MM-DDTHH:mm:ss.sss[Z]';

const dateToUnix = (dateTimeStamp = null) => {
  const timeStamp = dateTimeStamp ? new Date(dateTimeStamp).getTime() : Date.now();
  return Math.floor(timeStamp / 1000);
};

const unixToDateTime = (unixTimestamp) => new Date(unixTimestamp * 1000);

const convertDateToReadable = (dateTime, dateFormat = 'DD MMMM YYYY hh:mmA') =>
  dateTime ? dayjs(dateTime).format(dateFormat) : '';

const unixToReadableDate = (unixTimestamp, dateFormat = 'DD MMMM YYYY') => {
  if (!unixTimestamp) return '';
  return convertDateToReadable(unixToDateTime(unixTimestamp), dateFormat);
};

const nextMonthSameDay = () =>
  dayjs().add(1, 'month').hour(23).minute(59).second(59).millisecond(999).format(defaultUTCFormate);

const addDaysToCurrent = (days = 1) => dayjs().utc().add(parseInt(days), 'day').format(defaultUTCFormate);

const prevDayStart = () =>
  dayjs().utc().subtract(1, 'day').hour(0).minute(0).second(0).millisecond(0).format(defaultUTCFormate);

const subtract5minute = () => dayjs().utc().subtract(5, 'minute').format(defaultUTCFormate);

const subtractSeconds = (seconds) => dayjs().utc().subtract(seconds, 'second').format(defaultUTCFormate);

const getUTCDateTime = (timeStamp = '', format = defaultUTCFormate) =>
  timeStamp ? dayjs(timeStamp).utc().format(format) : dayjs().utc().format(format);

const convertFormate = (timeStamp, format = defaultUTCFormate) => dayjs(timeStamp).format(format);

const twoMonthsAgo = () => {
  const latesdate = new Date();
  return latesdate.setMonth(latesdate.getMonth() - 2);
};

module.exports = {
  dateToUnix,
  unixToDateTime,
  unixToReadableDate,
  convertDateToReadable,
  getUTCDateTime,
  nextMonthSameDay,
  convertFormate,
  addDaysToCurrent,
  prevDayStart,
  twoMonthsAgo,
  subtract5minute,
  subtractSeconds,
};
