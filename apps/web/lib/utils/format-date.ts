import { formatDistance, fromUnixTime } from 'date-fns';

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
  const time = fromUnixTime(date);
  return formatDistance(time, new Date(), { addSuffix: true });
};
