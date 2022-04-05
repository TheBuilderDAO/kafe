import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterVoteById } from '../filters';
import _ from 'lodash';

const voteAccountListByTutorialId = async (
  program: Program<Tutorial>,
  tutorialId: number,
) => program.account.voteAccount.all([filterVoteById(tutorialId)]);

export default voteAccountListByTutorialId;
