import { stringToBytes } from '../utils';

enum ReviewerOffset {
  GithubLogin = 46,
}

export const filterReviewerByGithubLogin = (login: string) => {
  const dataSize = ReviewerOffset.GithubLogin + login.length;
  return [
    {
      dataSize,
    },
    {
      memcmp: {
        offset: ReviewerOffset.GithubLogin,
        bytes: stringToBytes(login),
      },
    },
  ];
};
