
import axios from 'axios';

const gh_token = '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';

export const getFileFromGithub = async (url: string) => {
  const file = await axios.get(url, {
    headers: {
      Authorization: `token ${gh_token}`,
    },
  });
  return file.data;
};