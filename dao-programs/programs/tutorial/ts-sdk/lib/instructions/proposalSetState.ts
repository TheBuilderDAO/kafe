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

export const getProposalState = (proposalState: any): ProposalStateE => {
  const key = Object.keys(proposalState)[0] as ProposalStateE;
  return ProposalStateE[key];
};

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param proposalId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalSetState = async ({
  program,
  proposalId,
  adminPk,
  newState,
  signer,
}: {
  program: Program<Tutorial>;
  proposalId: number;
  adminPk: anchor.web3.PublicKey;
  newState: ProposalStateE;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaProposalById } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaProposalById(proposalId);

  const signature = await program.rpc.proposalSetState(newState, {
    accounts: {
      proposalAccount: proposalAccount.pda,
      daoAccount: daoAccount.pda,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalSetState;
