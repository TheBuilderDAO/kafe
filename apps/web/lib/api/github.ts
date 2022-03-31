import axios from 'axios';

export const getGithubUrl = (folder, path) => {
  return `https://raw.githubusercontent.com/TheBuilderDAO/kafe/${
    process.env.VERCEL_GIT_COMMIT_REF || 'dev'
  }/tutorials/${folder}/${path}`;
};

export const getFileFromGithub = async (folder, path) => {
  let githubUrl = getGithubUrl(folder, path);
  const file = await axios.get(githubUrl);
  return file.data;
};
