import * as anchor from '@project-serum/anchor';
import { IdlTypes, Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

export enum ProposalStateE {
  submitted = 'submitted',
  funded = 'funded',
  writing = 'writing',
  readyToPublish = 'readyToPublish',
  published = 'published',
}

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param tutorialId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalSetState = async ({
  program,
  mintPk,
  tutorialId,
  adminPk,
  newState,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  tutorialId: number;
  adminPk: anchor.web3.PublicKey;
  newState: ProposalStateE;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaTutorialById } = getPda(program.programId, mintPk);
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaTutorialById(tutorialId);

  const signature = await program.rpc.proposalSetState(newState, {
    accounts: {
      proposal: proposalAccount.pda,
      daoConfig: daoAccount.pda,
      signer: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalSetState;
