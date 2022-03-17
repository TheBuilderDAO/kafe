import { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import * as bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';

const listOfVoterBySlug = async (
  program: Program<Tutorial>,
  pdaTutorialBySlug: any,
  slug: string,
) => {
  const { pda } = await pdaTutorialBySlug(slug);
  return program.account.voteAccount.all([
    {
      memcmp: {
        offset: 9,
        bytes: bs58.encode(pda.toBuffer()),
      },
    },
  ]);
};

export default listOfVoterBySlug;
