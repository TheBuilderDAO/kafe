/* eslint-disable import/no-anonymous-default-export */
import { PublicKey } from '@solana/web3.js';

export default {
  daoState: '/dao/state',
  admin: '/admin',
  tutorialBySlug: (slug: string) => ['tutorials/slug', slug],
  tutorialById: (id: number) => ['tutorials/id', id],
  listOfVoters: (slug: string) => ['tutorials', slug, 'voters'],
  listOfReviewers: '/reviewers',
  reviewer: (publicKey: PublicKey) => ['reviewers', publicKey.toString()],
  vote: (slug: string, publicKey: PublicKey) => [
    'tutorials',
    slug,
    'voters',
    publicKey.toString(),
  ],
  proposal: '/proposal',
};
