import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getDatetimeDiff = (lastTime: string | Date): string => {
    if (lastTime == null) return '';
    const startTime = new Date(lastTime);
    const now = new Date();
    const Difference_In_Time = now.getTime() - startTime.getTime();
    const days = Difference_In_Time / (1000 * 3600 * 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 360);
    const start = dayjs(lastTime || new Date());
    const end = dayjs(new Date());
    const minutes = end.diff(start, 'minutes');

    if (minutes < 1) return 'a few seconds ago';

    if (years !== 0) {
        return `${years > 1 ? `${years} years` : '1 year'} ago`;
    } else if (months !== 0 && months < 12) {
        return `${months > 1 ? `${months} months` : '1 month'} ago`;
    } else if (weeks !== 0 && weeks < 4) {
        return `${weeks > 1 ? `${weeks} weeks` : '1 week'} ago`;
    } else if (days !== 0 && days > 1 && days < 31) {
        return `${Math.floor(days) > 1 ? `${Math.floor(days)} days` : '1 day'} ago`;
    } else {
        return `${dayjs.duration(minutes, 'minutes').humanize()} ago`;
    }
};

export const convertDateToReadable = (dateTime: string | Date, showTime = true, dateFormat = ''): string => {
    if (dateTime == null) return '';
    const format = dateFormat ? dateFormat : showTime ? 'DD MMMM YYYY hh:mmA' : 'DD MMMM YYYY';
    return dayjs(dateTime).format(format);
};

export const getMonthNameByNumber = (monthNumber: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthNumber - 1];
};

export const unixToReadableDate = (unixTimestamp: number, dateFormat = '') => {
    const date = new Date(unixTimestamp * 1000);
    return convertDateToReadable(date, false, dateFormat);
};
