/* eslint-disable import/no-anonymous-default-export */
import { PublicKey } from '@solana/web3.js';

export default {
  daoState: '/dao/state',
  admin: '/admin',
  tutorialBySlug: (slug: string) => ['tutorials/slug', slug],
  tutorialById: (id: number) => ['tutorials/id', id],
  listOfVoters: (tutorialId: number) => ['tutorials', tutorialId, 'voters'],
  listOfReviewers: '/reviewers',
  listOfTippers: '/tippers',
  listOfTippersById: (tutorialId: number) => [
    'tutorials',
    tutorialId,
    'tippers-by-id',
  ],
  listOfTippersByUser: (tipperPk: PublicKey) => [
    'tutorials',
    tipperPk,
    'tippers-by-user',
  ],
  reviewer: (publicKey: PublicKey) => ['reviewers', publicKey.toString()],
  vote: (tutorialId: number, publicKey: PublicKey) => [
    'tutorials',
    tutorialId,
    'voters',
    publicKey.toString(),
  ],
  proposal: '/proposal',
};
