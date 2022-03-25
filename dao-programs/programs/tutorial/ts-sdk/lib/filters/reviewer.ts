import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';

import { stringToBytes } from '../utils';

enum ReviewerOffset {
  GithubLogin = 46,
}

export const filterReviewerByGithubLogin = (login: string) => ({
  memcmp: {
    offset: ReviewerOffset.GithubLogin,
    bytes: stringToBytes(login),
  },
});
