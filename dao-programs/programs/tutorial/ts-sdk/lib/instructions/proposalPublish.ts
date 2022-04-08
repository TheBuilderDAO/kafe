import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param proposalId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalPublish = async ({
  program,
  mintKafePk,
  mintBdrPk,
  proposalId,
  authorPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintKafePk: anchor.web3.PublicKey;
  mintBdrPk: anchor.web3.PublicKey;
  proposalId: number;
  authorPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaProposalById, pdaDaoVaultAccount } = getPda(
    program.programId,
  );
  const authorAta = await getAta(authorPk, mintKafePk);
  const authorAtaBdr = await getAta(authorPk, mintBdrPk);
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount(mintKafePk);
  const daoVaultBDRAccount = await pdaDaoVaultAccount(mintBdrPk);
  const proposalAccount = await pdaProposalById(proposalId);
  const { reviewer1, reviewer2 } = await program.account.proposalAccount.fetch(
    proposalAccount.pda,
  );
  const reviewer1AtaBdr = await getAta(reviewer1, mintBdrPk);
  const reviewer2AtaBdr = await getAta(reviewer2, mintBdrPk);

  const signature = await program.rpc.proposalPublish(
    daoVaultAccount.bump,
    daoVaultBDRAccount.bump,
    {
      accounts: {
        proposalAccount: proposalAccount.pda,
        daoAccount: daoAccount.pda,
        daoVaultKafe: daoVaultAccount.pda,
        daoVaultBdr: daoVaultBDRAccount.pda,
        bdrTokenAccount: authorAtaBdr,
        mintBdr: mintBdrPk,
        mintKafe: mintKafePk,
        authority: adminPk,
        userTokenAccount: authorAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        reviewer1TokenAccount: reviewer1AtaBdr,
        reviewer2TokenAccount: reviewer2AtaBdr,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default proposalPublish;
