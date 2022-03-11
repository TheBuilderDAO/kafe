import { Program } from '@project-serum/anchor';
import * as bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';
import { getNumberBuffer } from '../utils';

const listOfVoterById = async (
  program: Program<Tutorial>,
  tutorialId: number,
) => {
  return program.account.voteAccount.all([
    {
      memcmp: {
        offset: 9,
        bytes: bs58.encode(getNumberBuffer(tutorialId)),
      },
    },
  ]);
};

export default listOfVoterById;
