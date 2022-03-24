import { formatDistance } from 'date-fns';

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-US', options);

  return now;
};

export const niceDate = (date: number | Date) => {
  return formatDistance(date, new Date());
};
