import * as anchor from '@project-serum/anchor';

const routes = {
  daoState: '/dao/state',
  admin: '/admin',
  tutorialBySlug: (slug: string) => ['tutorials/slug', slug],
  tutorialById: (id: number) => ['tutorials/id', id],
  listOfVotersById: (tutorialId: number) => ['tutorials', tutorialId, 'voters'],
  listOfVotersByIds: (tutorialIds: number[]) => [
    'tutorials',
    ...tutorialIds,
    'voters',
  ],
  listOfReviewers: '/reviewers',
  listOfTippers: '/tippers',
  listOfTippersById: (tutorialId: number) => [
    'tutorials',
    tutorialId,
    'tippers-by-id',
  ],
  listOfTippersByIds: (tutorialIds: number[]) => [
    'tutorials',
    ...tutorialIds,
    'tippers-by-id',
  ],
  listOfTippersByUser: (tipperPk: anchor.web3.PublicKey) => [
    'tutorials',
    tipperPk,
    'tippers-by-user',
  ],
  reviewer: (publicKey: anchor.web3.PublicKey) => [
    'reviewers',
    publicKey.toString(),
  ],
  vote: (tutorialId: number, publicKey: anchor.web3.PublicKey) => [
    'tutorials',
    tutorialId,
    'voters',
    publicKey.toString(),
  ],
  proposal: '/proposal',
};
export default routes;
