
import axios from 'axios';

const ghToken = '_TODO_';

export const getFileFromGithub = async (url: string) => {
  const file = await axios.get(url, {
    headers: {
      Authorization: `token ${ghToken}`,
    },
  });
  return file.data;
};