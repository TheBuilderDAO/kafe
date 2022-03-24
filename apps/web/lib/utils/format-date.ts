import distanceInWords from 'date-fns/distance_in_words';

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-US', options);

  return now;
};

export const niceDate = (date: string | number) => {
  return distanceInWords(date, new Date());
};
