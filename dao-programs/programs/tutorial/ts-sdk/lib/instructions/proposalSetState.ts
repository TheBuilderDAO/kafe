import * as anchor from '@project-serum/anchor';
import { IdlTypes, Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

export enum ProposalStateE {
  submitted = 'submitted',
  funded = 'funded',
  writing = 'writing',
  hasReviewers = 'hasReviewers',
  readyToPublish = 'readyToPublish',
  published = 'published',
}

export const numberFromProposalE = (state: ProposalStateE) => {
  if (state === ProposalStateE.submitted) return 0;
  if (state === ProposalStateE.funded) return 1;
  if (state === ProposalStateE.writing) return 2;
  if (state === ProposalStateE.hasReviewers) return 3;
  if (state === ProposalStateE.readyToPublish) return 4;
  if (state === ProposalStateE.published) return 5;
};

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
  slug,
  adminPk,
  newState,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  slug: string;
  adminPk: anchor.web3.PublicKey;
  newState: ProposalStateE;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaTutorialBySlug } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaTutorialBySlug(slug);

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
