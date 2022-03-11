import axios from 'axios';

export const fetcherWithConfig = (url, config) =>
  axios.get(url, config).then(res => res.data);
