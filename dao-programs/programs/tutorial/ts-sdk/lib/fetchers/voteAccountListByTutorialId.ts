import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterVoteById } from '../filters';

const voteAccountListByTutorialId = async (
  program: Program<Tutorial>,
  tutorialId: number,
) => program.account.voteAccount.all([filterVoteById(tutorialId)]);

export default voteAccountListByTutorialId;
