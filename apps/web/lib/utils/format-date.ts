import { formatDistance, fromUnixTime } from 'date-fns';

export const convertMillisecondsToSeconds = date => {
  return Number(date) / 1000;
};

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-US', options);

  return now;
};

export const formatUnix = date => {
  let time = convertMillisecondsToSeconds(date);
  time = fromUnixTime(time);
  return formatDistance(time, new Date(), { addSuffix: true });
};
