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
export const voteCaster = async ({
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
  const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('BuilderDAO'), userPk.toBuffer()],
    program.programId,
  );

  const signature = await program.rpc.voteCaster({
    accounts: {
      vote: pda,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      signer: userPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default voteCaster;
