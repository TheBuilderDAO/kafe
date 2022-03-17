import * as anchor from '@project-serum/anchor';

const PROGRAM_SEED = 'BuilderDAO';

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

  const pdaUserVoteAccountBySlug = async (
    user: anchor.web3.PublicKey,
    proposalPda: anchor.web3.PublicKey,
  ) => {
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), proposalPda.toBuffer(), user.toBuffer()],
      programId,
    );
    return { pda, bump };
  };

  const makeSlugSeed = async (slug: string) => {
    let seeds = [];
    while (slug.length > 32) {
      seeds.push(Buffer.from(slug.slice(0, 32)));
      slug = slug.slice(32);
    }
    const [pda] = await anchor.web3.PublicKey.findProgramAddress(
      [...seeds, Buffer.from(slug)],
      programId,
    );
    return pda;
  };

  const pdaTutorialBySlug = async (slug: string) => {
    const slugSeed = await makeSlugSeed(slug);
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROGRAM_SEED), slugSeed.toBuffer()],
      programId,
    );
    return { pda, bump, slugSeed };
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
    pdaUserVoteAccountBySlug,
    pdaReviewerAccount,
    pdaTutorialBySlug,
  };
};
