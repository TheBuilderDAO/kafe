import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterVoteById } from '../filters';
import _ from 'lodash';

export const voteAccountsHashmapByTutorialIds = async (
  program: Program<Tutorial>,
  tutorialIds: number[],
) => {
  const filters = tutorialIds.map(filterVoteById);
  const votes = program.account.voteAccount.all(filters);
  return _.groupBy(votes, 'account.tutorialId');
};

export default voteAccountsHashmapByTutorialIds;
