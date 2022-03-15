import * as anchor from '@project-serum/anchor';

import { getNumberBuffer } from './utils';

const PROGRAM_SEED = 'TheBuilderDAO';

export const getPda = (
  programId: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
) => {
  const pdaDaoAccount = async () => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED)],
      programId,
    );
    return { pda, bump };
  };

  const pdaDaoVaultAccount = async () => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), mint.toBuffer()],
      programId,
    );
    return { pda, bump };
  };

  const pdaTutorialById = async (id: number) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), getNumberBuffer(id)],
      programId,
    );
    return { pda, bump };
  };

  const pdaUserVoteAccountById = async (
    user: anchor.web3.PublicKey,
    id: number,
  ) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), getNumberBuffer(id), user.toBuffer()],
      programId,
    );
    return { pda, bump };
  };

  const pdaReviewerAccount = async (reviewer: anchor.web3.PublicKey) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), reviewer.toBuffer()],
      programId,
    );
    return { pda, bump };
  };

  return {
    pdaDaoAccount,
    pdaDaoVaultAccount,
    pdaTutorialById,
    pdaUserVoteAccountById,
    pdaReviewerAccount,
  };
};
