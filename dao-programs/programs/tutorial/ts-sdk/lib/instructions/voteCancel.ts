import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk Mint publicKey of KAFE token.
 * @param tutorialId tutorial number.
 * @param userPk user PublicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const voteCancel = async ({
  program,
  mintPk,
  slug,
  userPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  slug: string;
  userPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaUserVoteAccountBySlug, pdaTutorialBySlug } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaTutorialBySlug(slug);
  const voteAccount = await pdaUserVoteAccountBySlug(
    userPk,
    proposalAccount.pda,
  );

  const signature = await program.rpc.voteCancel({
    accounts: {
      vote: voteAccount.pda,
      daoConfig: daoAccount.pda,
      tutorial: proposalAccount.pda,
      mint: mintPk,
      author: userPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default voteCancel;
