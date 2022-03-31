import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

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
 * @param proposalId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalSetCreator = async ({
  program,
  proposalId,
  mintPk,
  creatorPk,
  superAdminPk,
  signer,
}: {
  program: Program<Tutorial>;
  proposalId: number;
  creatorPk: anchor.web3.PublicKey;
  mintPk: anchor.web3.PublicKey;
  superAdminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaProposalById, pdaDaoVaultAccount } = getPda(
    program.programId,
  );
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaProposalById(proposalId);
  const kafeVaultAccount = await pdaDaoVaultAccount(mintPk);
  const creatorTokenAccount = await getAssociatedTokenAddress(
    mintPk,
    creatorPk,
  );

  const signature = await program.rpc.proposalSetCreator(
    kafeVaultAccount.bump,
    {
      accounts: {
        proposalAccount: proposalAccount.pda,
        daoAccount: daoAccount.pda,
        creator: creatorPk,
        systemProgram: anchor.web3.SystemProgram.programId,
        daoVaultKafe: kafeVaultAccount.pda,
        mintKafe: mintPk,
        creatorTokenAccount: creatorTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        superAdmin: superAdminPk,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default proposalSetCreator;
