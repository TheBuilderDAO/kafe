import axios from 'axios';

const gh_token = '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';
export const getGithubUrl = (folder, path) => {
  return `https://raw.githubusercontent.com/TheBuilderDAO/kafe/${
    process.env.VERCEL_GIT_COMMIT_REF || 'nk/md-formatter'
  }/tutorials/${folder}/${path}`;
};

export const getFileFromGithub = async (folder, path) => {
  let githubUrl = getGithubUrl(folder, path);
  const file = await axios.get(githubUrl, {
    headers: {
      Authorization: `token ${gh_token}`,
    },
  });
  return file.data;
};
