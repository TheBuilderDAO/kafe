import * as anchor from '@project-serum/anchor';

import { getNumberBuffer } from './utils';

const PROGRAM_SEED = 'BuilderDAO';
const TIPPING_SEED = 'Tipping';

export const getPda = (programId: anchor.web3.PublicKey) => {
  const pdaDaoAccount = async () => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED)],
      programId,
    );
    return { pda, bump };
  };

  const pdaDaoVaultAccount = async (mint: anchor.web3.PublicKey) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), mint.toBuffer()],
      programId,
    );
    return { pda, bump };
  };

  const pdaProposalById = async (id: number) => {
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

  const pdaTipperAccount = async (
    guide_id: number,
    tipper: anchor.web3.PublicKey,
  ) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(PROGRAM_SEED),
        Buffer.from(TIPPING_SEED),
        getNumberBuffer(guide_id),
        tipper.toBuffer(),
      ],
      programId,
    );
    return { pda, bump };
  };

  return {
    pdaDaoAccount,
    pdaDaoVaultAccount,
    pdaProposalById,
    pdaUserVoteAccountById,
    pdaReviewerAccount,
    pdaTipperAccount,
  };
};
