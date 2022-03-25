import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param proposalId tutorial Id.
 * @param tipperPk user publicKey.
 * @param amount amount to distribute among reviewers and creator.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const guideTipping = async ({
  program,
  mintPk,
  proposalId,
  tipperPk,
  amount,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  proposalId: number;
  tipperPk: anchor.web3.PublicKey;
  amount: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaTutorialById, pdaTipperAccount, pdaDaoVaultAccount } = getPda(
    program.programId,
    mintPk,
  );
  const proposal = await pdaTutorialById(proposalId);
  const tipper = await pdaTipperAccount(proposalId, tipperPk);
  const daoVaultAccount = await pdaDaoVaultAccount();

  const { creator, reviewer1, reviewer2 } =
    await program.account.proposalAccount.fetch(proposal.pda);

  const creatorTokenAccount = await getAta(creator, mintPk);
  const reviewer1TokenAccount = await getAta(reviewer1, mintPk);
  const reviewer2TokenAccount = await getAta(reviewer2, mintPk);

  const signature = await program.rpc.guideTipping(
    tipper.bump,
    amount,
    daoVaultAccount.bump,
    {
      accounts: {
        tipper: tipper.pda,
        proposal: proposal.pda,
        creator,
        reviewer2,
        reviewer1,
        signer: tipperPk,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        daoVaultKafe: daoVaultAccount.pda,
        mintKafe: mintPk,
        creatorTokenAccount: creatorTokenAccount,
        reviewer1TokenAccount: reviewer1TokenAccount,
        reviewer2TokenAccount: reviewer2TokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default guideTipping;
