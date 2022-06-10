/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable jest/expect-expect */
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  Account,
  mintTo,
  freezeAccount,
  setAuthority,
  AuthorityType,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import {
  daoAccount as getDaoAccount,
  daoVaultAccountBalance as getDaoVaultAccountBalance,
  proposalAccountBySlug as getProposalAccountBySlug,
  proposalAccountById as getProposalAccountById,
  proposalAccountByStreamId as getProposalAccountByStreamId,
  reviewerAccountByReviewerPK as getReviewerAccount,
  reviewerAccountByGithubLogin as getReviewerAccountByGithubLogin,
  userVoteAccountById as getUserVoteAccountById,
  voteAccountListByTutorialId as getVoteAccountListByTutorialId,
  tipperAccountsListById as getTipperAccountsListById,
  tipperAccountListByUser as getTipperAccountListByUser,
} from '../ts-sdk/lib/fetchers';

import { Tutorial } from '../ts-sdk/lib/idl/tutorial';
import {
  daoInitialize,
  daoVaultInitialize,
  daoAddAdmin,
  daoRemoveAdmin,
  daoSetAmountToCreateProposal,
  daoSetQuorum,
  daoSetNonce,
  proposalClose,
  proposalCreate,
  proposalSetCreator,
  voteCast,
  voteCancel,
  reviewerAssign,
  reviewerCreate,
  reviewerDelete,
  proposalSetState,
  guideTipping,
  proposalPublish,
  tipperClose,
  daoVaultClose,
  daoClose,
  airdrop,
} from '../ts-sdk/lib/instructions';

import { filterProposalByState, ProposalStateE } from '../ts-sdk';

import { airdrops, getAta } from '../ts-sdk/lib/utils';
import { getPda } from '../ts-sdk/lib/pda';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// beforeAll(() => {
//   jest.spyOn(console, 'error').mockImplementation(jest.fn());
// });

describe('tutorial-program', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Tutorial as Program<Tutorial>;

  // Declare our Mint & authority & user
  let auth1 = anchor.web3.Keypair.generate();
  let auth2 = anchor.web3.Keypair.generate();
  let reviewer1 = anchor.web3.Keypair.generate();
  let reviewer2 = anchor.web3.Keypair.generate();
  let reviewer3 = anchor.web3.Keypair.generate();
  let user1 = anchor.web3.Keypair.generate();
  let user2 = anchor.web3.Keypair.generate();
  let mintAuth = anchor.web3.Keypair.generate();
  let superAdmin = anchor.web3.Keypair.generate();

  let user1Ata: Account;
  let user2Ata: Account;
  let reviewer1Ata: Account;
  let reviewer2Ata: Account;
  let reviewer3Ata: Account;
  let superAdminAta: Account;

  let user1AtaBDR: Account;
  let user2AtaBDR: Account;
  let reviewer1AtaBDR: Account;
  let reviewer2AtaBDR: Account;
  let reviewer3AtaBDR: Account;
  let superAdminAtaBDR: Account;

  const githubLogin1 = 'Bob';
  const githubLogin2 = 'Alice';

  const slug1 = 'delpoy-a-polkadot-smart-contract';
  const streamId1 =
    'kjzl6cwe1jw145i2z2cd6aedcwzcs3p3buecsoel5mzmitc6g8z0ccj9sbcmdmw';

  const slug2 = 'near-101';
  const streamId2 =
    'kjzl6cwe1jw149hl95f35wz2z861uw6yxm4iyc29bhpyx726wy59t8hpbqow26h';

  let mintKafe: anchor.web3.PublicKey;
  let mintBDR: anchor.web3.PublicKey;
  const decimals = 6;

  const {
    pdaDaoAccount,
    pdaDaoVaultAccount,
    pdaProposalById,
    pdaReviewerAccount,
    pdaUserVoteAccountById,
  } = getPda(program.programId);

  test('Setup env', async () => {
    await airdrops(provider, [
      auth1,
      auth2,
      superAdmin,
      user1,
      user2,
      mintAuth,
      reviewer1,
      reviewer2,
      reviewer3,
    ]);

    // Create mint
    mintKafe = await createMint(
      provider.connection,
      mintAuth,
      mintAuth.publicKey,
      null,
      decimals,
    );
    mintBDR = await createMint(
      provider.connection,
      mintAuth,
      mintAuth.publicKey,
      mintAuth.publicKey,
      decimals,
    );

    expect(mintKafe).toBeTruthy();
    expect(mintBDR).toBeTruthy();

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        superAdmin.publicKey,
        2000 * LAMPORTS_PER_SOL,
      ),
      'confirmed',
    );
  });

  test('create userATAs Kafe', async () => {
    // create  associated token account
    user1Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user1,
      mintKafe,
      user1.publicKey,
    );
    user2Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user2,
      mintKafe,
      user2.publicKey,
    );
    reviewer1Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer1,
      mintKafe,
      reviewer1.publicKey,
    );
    reviewer2Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer2,
      mintKafe,
      reviewer2.publicKey,
    );
    reviewer3Ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer3,
      mintKafe,
      reviewer3.publicKey,
    );
    superAdminAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      superAdmin,
      mintKafe,
      superAdmin.publicKey,
    );

    // Mint tokens to token account
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      user1Ata.address,
      mintAuth.publicKey,
      2_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      user2Ata.address,
      mintAuth.publicKey,
      2_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      reviewer1Ata.address,
      mintAuth.publicKey,
      2_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      reviewer2Ata.address,
      mintAuth.publicKey,
      2_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      reviewer3Ata.address,
      mintAuth.publicKey,
      2_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      superAdminAta.address,
      mintAuth.publicKey,
      2_000_000,
    );

    const user1tokenAmount = await provider.connection.getTokenAccountBalance(
      user1Ata.address,
    );
    const user2tokenAmount = await provider.connection.getTokenAccountBalance(
      user2Ata.address,
    );
    const reviewer1tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer1Ata.address);
    const reviewer2tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer2Ata.address);
    const reviewer3tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer3Ata.address);

    expect(user1tokenAmount.value.amount).toBe('2000000');
    expect(user2tokenAmount.value.amount).toBe('2000000');
    expect(reviewer1tokenAmount.value.amount).toBe('2000000');
    expect(reviewer2tokenAmount.value.amount).toBe('2000000');
    expect(reviewer3tokenAmount.value.amount).toBe('2000000');
  });

  test('create userATAs BDR', async () => {
    // create  associated token account
    user1AtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user1,
      mintBDR,
      user1.publicKey,
    );
    user2AtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user2,
      mintBDR,
      user2.publicKey,
    );
    reviewer1AtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer1,
      mintBDR,
      reviewer1.publicKey,
    );
    reviewer2AtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer2,
      mintBDR,
      reviewer2.publicKey,
    );
    reviewer3AtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      reviewer3,
      mintBDR,
      reviewer3.publicKey,
    );
    superAdminAtaBDR = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      superAdmin,
      mintBDR,
      superAdmin.publicKey,
    );

    // Mint tokens to token account
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      user1AtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      user2AtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      reviewer1AtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      reviewer2AtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      reviewer3AtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      superAdminAtaBDR.address,
      mintAuth.publicKey,
      1_000_000,
    );

    await freezeAccount(
      provider.connection,
      mintAuth,
      user1AtaBDR.address,
      mintBDR,
      mintAuth.publicKey,
    );
    await freezeAccount(
      provider.connection,
      mintAuth,
      user2AtaBDR.address,
      mintBDR,
      mintAuth.publicKey,
    );
    await freezeAccount(
      provider.connection,
      mintAuth,
      reviewer1AtaBDR.address,
      mintBDR,
      mintAuth.publicKey,
    );
    await freezeAccount(
      provider.connection,
      mintAuth,
      reviewer2AtaBDR.address,
      mintBDR,
      mintAuth.publicKey,
    );
    await freezeAccount(
      provider.connection,
      mintAuth,
      reviewer3AtaBDR.address,
      mintBDR,
      mintAuth.publicKey,
    );

    const user1tokenAmount = await provider.connection.getTokenAccountBalance(
      user1AtaBDR.address,
    );
    const user2tokenAmount = await provider.connection.getTokenAccountBalance(
      user2AtaBDR.address,
    );
    const reviewer1tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer1AtaBDR.address);
    const reviewer2tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer2AtaBDR.address);
    const reviewer3tokenAmount =
      await provider.connection.getTokenAccountBalance(reviewer3AtaBDR.address);

    expect(user1tokenAmount.value.amount).toBe('1000000');
    expect(user2tokenAmount.value.amount).toBe('1000000');
    expect(reviewer1tokenAmount.value.amount).toBe('1000000');
    expect(reviewer2tokenAmount.value.amount).toBe('1000000');
    expect(reviewer3tokenAmount.value.amount).toBe('1000000');
  });

  test('Initialize daoAccount', async () => {
    const quorum = new anchor.BN(100);
    const minAmountToCreateProposal = new anchor.BN(1_000_000);
    await daoInitialize({
      program,
      minAmountToCreateProposal,
      admins: [auth1.publicKey, auth2.publicKey],
      payerPk: auth1.publicKey,
      superAdmin: superAdmin.publicKey,
      quorum,
      signer: auth1,
    });

    const daoAccount = await getDaoAccount(program, pdaDaoAccount);

    expect(daoAccount.quorum.toNumber()).toBe(quorum.toNumber());
    expect(daoAccount.admins.length).toBe(2);
    expect(daoAccount.nonce.toNumber()).toBe(0);
    expect(daoAccount.numberOfProposal.toNumber()).toBe(0);
    expect(daoAccount.minAmountToCreateProposal.toNumber()).toBe(
      new anchor.BN(1_000_000).toNumber(),
    );

    await reviewerCreate({
      program: program,
      adminPk: superAdmin.publicKey,
      reviewerPk: superAdmin.publicKey,
      githubName: 'sudo',
      signer: superAdmin,
    });
  });

  test('Dao Account setter', async () => {
    let daoAccount;
    const { pdaDaoAccount } = getPda(program.programId);

    await daoAddAdmin({
      program,
      userPk: user1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.admins.length).toBe(3);

    await daoRemoveAdmin({
      program,
      userPk: user1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.admins.length).toBe(2);

    await daoSetQuorum({
      program,
      adminPk: auth1.publicKey,
      quorum: 2,
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.quorum.toNumber()).toBe(2);

    await daoSetNonce({
      program,
      adminPk: superAdmin.publicKey,
      nonce: new anchor.BN(2),
      signer: superAdmin,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.nonce.toNumber()).toBe(2);
    await daoSetNonce({
      program,
      adminPk: superAdmin.publicKey,
      nonce: new anchor.BN(0),
      signer: superAdmin,
    });

    await daoSetAmountToCreateProposal({
      program,
      adminPk: auth1.publicKey,
      amount: new anchor.BN(1_500_000),
      signer: auth1,
    });

    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.minAmountToCreateProposal.toNumber()).toBe(1_500_000);
  });

  test('Initialize dao Kafe Vault', async () => {
    await daoVaultInitialize({
      program,
      mintPk: mintKafe,
      superAdmin: superAdmin.publicKey,
      payerPk: auth1.publicKey,
      signer: auth1,
    });

    let daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      mintKafe,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(0);
    expect(daoVaultAccountBalance.decimals).toBe(6);

    const pdaVaultKafe = await pdaDaoVaultAccount(mintKafe);
    await mintTo(
      provider.connection,
      mintAuth,
      mintKafe,
      pdaVaultKafe.pda,
      mintAuth.publicKey,
      10 ** 12,
    );

    daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      mintKafe,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(10 ** 6);
    expect(daoVaultAccountBalance.decimals).toBe(6);
  });

  test('Initialize dao BDR Vault', async () => {
    await daoVaultInitialize({
      program,
      mintPk: mintBDR,
      superAdmin: superAdmin.publicKey,
      payerPk: auth1.publicKey,
      signer: auth1,
    });

    let daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      mintBDR,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(0);
    expect(daoVaultAccountBalance.decimals).toBe(6);

    const pdaVaultBDR = await pdaDaoVaultAccount(mintBDR);
    await mintTo(
      provider.connection,
      mintAuth,
      mintBDR,
      pdaVaultBDR.pda,
      mintAuth.publicKey,
      10 ** 12,
    );

    daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      mintBDR,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(10 ** 6);
    expect(daoVaultAccountBalance.decimals).toBe(6);

    await setAuthority(
      provider.connection,
      mintAuth,
      mintBDR,
      mintAuth.publicKey,
      AuthorityType.FreezeAccount,
      pdaVaultBDR.pda,
    );
  });

  test('Airdrop with existing Ata', async () => {
    const memberPk = reviewer3.publicKey;
    await airdrop({
      program,
      memberPk,
      mintKafePk: mintKafe,
      mintBdrPk: mintBDR,
      authority: auth1,
    });
    const bdrAssociatedToken = await getAssociatedTokenAddress(
      mintBDR,
      memberPk,
    );
    const bdrTokenBalance = await provider.connection.getTokenAccountBalance(
      bdrAssociatedToken,
    );
    const bdrAmount = parseInt(bdrTokenBalance.value.amount);
    expect(bdrAmount).toBe(101_000_000);

    const kafeAssociatedToken = await getAssociatedTokenAddress(
      mintKafe,
      memberPk,
    );
    const kafeTokenBalance = await provider.connection.getTokenAccountBalance(
      kafeAssociatedToken,
    );
    const kafeAmount = parseInt(kafeTokenBalance.value.amount);
    expect(kafeAmount).toBe(3_000_000);
  });

  test('Airdrop to keypair', async () => {
    const memberPk = anchor.web3.Keypair.generate().publicKey;
    await airdrop({
      program,
      memberPk,
      mintKafePk: mintKafe,
      mintBdrPk: mintBDR,
      authority: auth1,
    });
    const bdrAssociatedToken = await getAssociatedTokenAddress(
      mintBDR,
      memberPk,
    );
    const bdrTokenBalance = await provider.connection.getTokenAccountBalance(
      bdrAssociatedToken,
    );
    const bdrAmount = parseInt(bdrTokenBalance.value.amount);
    expect(bdrAmount).toBe(100_000_000);

    const kafeAssociatedToken = await getAssociatedTokenAddress(
      mintKafe,
      memberPk,
    );
    const kafeTokenBalance = await provider.connection.getTokenAccountBalance(
      kafeAssociatedToken,
    );
    const kafeAmount = parseInt(kafeTokenBalance.value.amount);
    expect(kafeAmount).toBe(1_000_000);
  });

  test('Airdrop to wallet', async () => {
    const memberPk = provider.wallet.publicKey;
    await airdrop({
      program,
      memberPk,
      mintKafePk: mintKafe,
      mintBdrPk: mintBDR,
      authority: auth1,
    });
    const bdrAssociatedToken = await getAssociatedTokenAddress(
      mintBDR,
      memberPk,
    );
    const bdrTokenBalance = await provider.connection.getTokenAccountBalance(
      bdrAssociatedToken,
    );
    const bdrAmount = parseInt(bdrTokenBalance.value.amount);
    expect(bdrAmount).toBe(100_000_000);

    const kafeAssociatedToken = await getAssociatedTokenAddress(
      mintKafe,
      memberPk,
    );
    const kafeTokenBalance = await provider.connection.getTokenAccountBalance(
      kafeAssociatedToken,
    );
    const kafeAmount = parseInt(kafeTokenBalance.value.amount);
    expect(kafeAmount).toBe(1_000_000);
  });

  test('User1 Create a tutorial', async () => {
    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mintKafe,
      mintBdrPk: mintBDR,
      proposalId: 0,
      userPk: user1.publicKey,
      slug: slug1,
      streamId: streamId1,
      signer: user1,
    });
    proposalAccount = await getProposalAccountById(program, pdaProposalById, 0);
    expect(proposalAccount.id.toNumber()).toBe(0);

    proposalAccount = await getProposalAccountByStreamId(program, streamId1);
    expect(proposalAccount.id.toNumber()).toBe(0);

    proposalAccount = await getProposalAccountBySlug(program, slug1);
    expect(proposalAccount.creator.toString()).toBe(user1.publicKey.toString());
    expect(proposalAccount.numberOfVoter.toNumber()).toBe(0);
    expect(proposalAccount.slug).toBe(slug1);
    expect(proposalAccount.streamId).toBe(streamId1);
    expect(Object.keys(proposalAccount.state)[0]).toBe('submitted');
  });

  test('User2 Create tutorial 1 using nonce', async () => {
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);
    const nonce = daoAccount.nonce.toNumber();

    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mintKafe,
      mintBdrPk: mintBDR,
      proposalId: nonce,
      userPk: user2.publicKey,
      slug: slug2,
      streamId: streamId2,
      signer: user2,
    });
    proposalAccount = await getProposalAccountBySlug(program, slug2);
    expect(proposalAccount.creator.toString()).toBe(user2.publicKey.toString());
    expect(proposalAccount.id.toNumber()).toBe(nonce);
    expect(proposalAccount.slug).toBe(slug2);
    expect(proposalAccount.streamId).toBe(streamId2);
  });

  test('User1 Cast a Vote on Tutorial0', async () => {
    await voteCast({
      program,
      mintBdrPk: mintBDR,
      proposalId: 0,
      voterPk: user1.publicKey,
      signer: user1,
    });
    const voteAccount = await getUserVoteAccountById(
      program,
      pdaUserVoteAccountById,
      user1.publicKey,
      0,
    );
    expect(voteAccount.id.toNumber()).toBe(0);
    expect(voteAccount.author.toString()).toBe(user1.publicKey.toString());
    const listOfVoter = await getVoteAccountListByTutorialId(program, 0);
    expect(listOfVoter).toHaveLength(1);
  });

  test('User1 Cancel a Vote on Tutorial0', async () => {
    await voteCancel({
      program,
      proposalId: 0,
      voterPk: user1.publicKey,
      authorPk: user1.publicKey,
      signer: user1,
    });
    const listOfVoter = await getVoteAccountListByTutorialId(program, 0);
    expect(listOfVoter).toHaveLength(0);
  });

  test('Create a reviewer', async () => {
    let reviewerAccount: any;
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer2.publicKey,
      githubName: githubLogin1,
      signer: auth1,
    });
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer1.publicKey,
      githubName: githubLogin2,
      signer: auth1,
    });

    reviewerAccount = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      reviewer1.publicKey,
    );
    expect(reviewerAccount.pubkey.toString()).toBe(
      reviewer1.publicKey.toString(),
    );
    expect(reviewerAccount.numberOfAssignment).toBe(0);
    expect(reviewerAccount.github_name).not.toBe(githubLogin1);

    reviewerAccount = await getReviewerAccountByGithubLogin(
      program,
      githubLogin1,
    );
    expect(reviewerAccount.github_name).not.toBe(githubLogin1);
  });

  test('Delete a reviewer', async () => {
    await reviewerDelete({
      program,
      reviewerPk: reviewer1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    await expect(
      getReviewerAccount(program, pdaReviewerAccount, reviewer1.publicKey),
    ).rejects.toThrow();
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer1.publicKey,
      githubName: githubLogin1,
      signer: auth1,
    });
  });

  test('Reviewer: Creator cannot be a reviewer', async () => {
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: user1.publicKey,
      githubName: 'user1',
      signer: auth1,
    });
    await expect(
      reviewerAssign({
        program: program,
        adminPk: auth1.publicKey,
        reviewer1Pk: user1.publicKey,
        reviewer2Pk: reviewer2.publicKey,
        proposalId: 0,
        signer: auth1,
      }),
    ).rejects.toThrow();
  });

  test('Reviewer: Force assignment for user2 on tutorial 1', async () => {
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: user2.publicKey,
      githubName: 'user2',
      signer: auth1,
    });
    await reviewerAssign({
      program: program,
      adminPk: auth1.publicKey,
      reviewer1Pk: user2.publicKey,
      reviewer2Pk: user2.publicKey,
      proposalId: 1,
      force: true,
      signer: auth1,
    });

    const reviewerAccount: any = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      user2.publicKey,
    );
    expect(reviewerAccount.numberOfAssignment).toBe(1);

    const proposalAccount = await getProposalAccountBySlug(program, slug2);
    expect(proposalAccount.reviewer1.toString()).toBe(
      user2.publicKey.toString(),
    );
    expect(proposalAccount.reviewer2.toString()).toBe(
      user2.publicKey.toString(),
    );
  });

  test('Assign reviewers', async () => {
    const slug = 'delpoy-a-polkadot-smart-contract';
    await reviewerAssign({
      program: program,
      adminPk: auth1.publicKey,
      reviewer1Pk: reviewer1.publicKey,
      reviewer2Pk: reviewer2.publicKey,
      proposalId: 0,
      signer: auth1,
    });

    const reviewerAccount1: any = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      reviewer1.publicKey,
    );
    expect(reviewerAccount1.numberOfAssignment).toBe(1);

    const reviewerAccount2: any = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      reviewer2.publicKey,
    );
    expect(reviewerAccount2.numberOfAssignment).toBe(1);

    const proposalAccount = await getProposalAccountBySlug(program, slug);
    expect(proposalAccount.reviewer1.toString()).toBe(
      reviewer1.publicKey.toString(),
    );
    expect(proposalAccount.reviewer1.toString()).toBe(
      reviewerAccount1.pubkey.toString(),
    );

    expect(proposalAccount.reviewer2.toString()).toBe(
      reviewer2.publicKey.toString(),
    );
    expect(proposalAccount.reviewer2.toString()).toBe(
      reviewerAccount2.pubkey.toString(),
    );
  });

  test('Cannot create two times the same reviewer', async () => {
    await reviewerCreate({
      program: program,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer3.publicKey,
      githubName: 'Yash',
      signer: auth1,
    });
    await expect(
      reviewerCreate({
        program: program,
        adminPk: auth1.publicKey,
        reviewerPk: reviewer3.publicKey,
        githubName: 'Yash',
        signer: auth1,
      }),
    ).rejects.toThrow();
  });

  test('Proposal set State: test all valid state', async () => {
    let proposalAccount: any;
    const slug = 'delpoy-a-polkadot-smart-contract';
    const validState = [
      ProposalStateE.funded,
      ProposalStateE.submitted,
      ProposalStateE.writing,
      ProposalStateE.readyToPublish,
      ProposalStateE.published,
    ];
    for (let state of validState) {
      await proposalSetState({
        program: program,
        proposalId: 0,
        adminPk: auth1.publicKey,
        newState: state,
        signer: auth1,
      });
      proposalAccount = await getProposalAccountBySlug(program, slug);
      expect(Object.keys(proposalAccount.state)[0]).toBe(state);
    }
    proposalAccount = await program.account.proposalAccount.all([
      filterProposalByState(ProposalStateE.published),
    ]);
    expect(proposalAccount.length).toBe(1);
  });

  test('Proposal set State: test an invalid state', async () => {
    const invalidState = 'badstate';
    await expect(
      proposalSetState({
        program: program,
        tutorialId: 0,
        adminPk: auth1.publicKey,
        // @ts-ignore
        newState: invalidState,
        signer: auth1,
      }),
    ).rejects.toThrow();
  });

  test('Publishing: user1 publish the guide', async () => {
    await proposalSetState({
      program: program,
      proposalId: 0,
      adminPk: auth1.publicKey,
      newState: ProposalStateE.readyToPublish,
      signer: auth1,
    });
    let tokenAmount = await provider.connection.getTokenAccountBalance(
      user1Ata.address,
    );
    await proposalPublish({
      program,
      mintKafePk: mintKafe,
      mintBdrPk: mintBDR,
      proposalId: 0,
      adminPk: auth1.publicKey,
      authorPk: user1.publicKey,
      signer: auth1,
    });
    tokenAmount = await provider.connection.getTokenAccountBalance(
      user1Ata.address,
    );

    expect(tokenAmount.value.amount).toBe('2500000');
  });

  test('user2 tip a tutorial', async () => {
    // Amount to tip in LAMPORT
    const tippedAmount = new anchor.BN(10_000_000_000);
    const tippingCost = new anchor.BN(1_292_600);

    const CREATOR_WEIGHT = 70 / 100;
    const REVIEWER_WEIGHT = 15 / 100;

    // Initial balance of actors
    const initialTipperBalance = await provider.connection.getBalance(
      user2.publicKey,
    );
    const initialCreatorBalance = await provider.connection.getBalance(
      user1.publicKey,
    );
    const initialReviewer1Balance = await provider.connection.getBalance(
      reviewer1.publicKey,
    );
    const initialReviewer2Balance = await provider.connection.getBalance(
      reviewer2.publicKey,
    );

    let bdrBalance0 = await provider.connection.getTokenAccountBalance(
      user2AtaBDR.address,
    );
    expect(bdrBalance0.value.amount).toBe('51000000');

    // Tipping instruction
    await guideTipping({
      program,
      mintKafe,
      mintBDR,
      proposalId: 0,
      tipperPk: user2.publicKey,
      amount: tippedAmount,
      signer: user2,
    });

    // Final balance of actors
    const finalTipperBalance = await provider.connection.getBalance(
      user2.publicKey,
    );
    const finalCreatorBalance = await provider.connection.getBalance(
      user1.publicKey,
    );
    const finalReviewer1Balance = await provider.connection.getBalance(
      reviewer1.publicKey,
    );
    const finalReviewer2Balance = await provider.connection.getBalance(
      reviewer2.publicKey,
    );
    let bdrBalance = await provider.connection.getTokenAccountBalance(
      user2AtaBDR.address,
    );

    expect(bdrBalance.value.amount).toBe('51000001');

    // Basic check
    expect(initialTipperBalance - finalTipperBalance).toBe(
      tippedAmount.toNumber() + tippingCost.toNumber(),
    );
    expect(finalCreatorBalance - initialCreatorBalance).toBe(
      CREATOR_WEIGHT * tippedAmount.toNumber(),
    );
    expect(finalReviewer1Balance - initialReviewer1Balance).toBe(
      REVIEWER_WEIGHT * tippedAmount.toNumber(),
    );
    expect(finalReviewer2Balance - initialReviewer2Balance).toBe(
      REVIEWER_WEIGHT * tippedAmount.toNumber(),
    );
  });

  test('An anonymous tip a tutorial', async () => {
    // Amount to tip in LAMPORT
    const tippedAmount = new anchor.BN(10_000_000_000);
    const tippingAndCreateAtaCost = new anchor.BN(1292608);

    const CREATOR_WEIGHT = 70 / 100;
    const REVIEWER_WEIGHT = 15 / 100;

    // Initial balance of actors
    const initialTipperBalance = await provider.connection.getBalance(
      provider.wallet.publicKey,
    );
    const initialCreatorBalance = await provider.connection.getBalance(
      user1.publicKey,
    );
    const initialReviewer1Balance = await provider.connection.getBalance(
      reviewer1.publicKey,
    );
    const initialReviewer2Balance = await provider.connection.getBalance(
      reviewer2.publicKey,
    );

    // Tipping instruction
    await guideTipping({
      program,
      mintKafe,
      mintBDR,
      proposalId: 0,
      tipperPk: provider.wallet.publicKey,
      amount: tippedAmount,
    });

    // Final balance of actors
    const finalTipperBalance = await provider.connection.getBalance(
      provider.wallet.publicKey,
    );
    const finalCreatorBalance = await provider.connection.getBalance(
      user1.publicKey,
    );
    const finalReviewer1Balance = await provider.connection.getBalance(
      reviewer1.publicKey,
    );
    const finalReviewer2Balance = await provider.connection.getBalance(
      reviewer2.publicKey,
    );
    let walletAta = await getAta(provider.wallet.publicKey, mintBDR);
    const bdrBalance = await provider.connection.getTokenAccountBalance(
      walletAta,
    );
    expect(bdrBalance.value.amount).toBe('100000001');

    // Basic check
    expect(initialTipperBalance - finalTipperBalance).toBe(
      tippedAmount.toNumber() + tippingAndCreateAtaCost.toNumber(),
    );
    expect(finalCreatorBalance - initialCreatorBalance).toBe(
      CREATOR_WEIGHT * tippedAmount.toNumber(),
    );
    expect(finalReviewer1Balance - initialReviewer1Balance).toBe(
      REVIEWER_WEIGHT * tippedAmount.toNumber(),
    );
    expect(finalReviewer2Balance - initialReviewer2Balance).toBe(
      REVIEWER_WEIGHT * tippedAmount.toNumber(),
    );
  });

  test('user2 tip again the same guide', async () => {
    await guideTipping({
      program,
      mintKafe,
      mintBDR,
      proposalId: 0,
      tipperPk: user2.publicKey,
      amount: new anchor.BN(1_000_000_000),
      signer: user2,
    });
    const tipperInfo = await getTipperAccountListByUser(
      program,
      user2.publicKey,
    );
    expect(tipperInfo[0].account.amount.toNumber()).toBe(11_000_000_000);
  });

  test('user2 tip until the guide as been tipped 10 times', async () => {
    const balance0 = await provider.connection.getTokenAccountBalance(
      user1Ata.address,
    );
    const amount0 = parseInt(balance0.value.amount);
    for (let i = 0; i < 10; i++) {
      await guideTipping({
        program,
        mintKafe,
        mintBDR,
        proposalId: 0,
        tipperPk: user2.publicKey,
        amount: new anchor.BN(5_000_000),
        signer: user2,
      });
    }

    const balance = await provider.connection.getTokenAccountBalance(
      user1Ata.address,
    );
    const amount = parseInt(balance.value.amount);
    expect(amount0 + 1_000_000).toBe(amount);
  });

  test('reviewer3 tip the guide', async () => {
    await guideTipping({
      program,
      mintKafe,
      mintBDR,
      proposalId: 0,
      tipperPk: reviewer3.publicKey,
      amount: new anchor.BN(1_000_000),
      signer: reviewer3,
    });
    const tipperInfo = await getTipperAccountsListById(program, 0);
    expect(tipperInfo.length).toBe(3);
  });

  test('Close tipper for reviewer3.', async () => {
    await tipperClose({
      program,
      guideId: 0,
      tipperPk: reviewer3.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    const tipperInfo = await getTipperAccountsListById(program, 0);
    expect(tipperInfo.length).toBe(2);
  });

  test('user2 tip too  much', async () => {
    // Amount to tip in LAMPORT
    const tippedAmount = new anchor.BN(100_000_000_000);

    // Tipping instruction
    await expect(
      guideTipping({
        program,
        mintKafe,
        mintBDR,
        proposalId: 0,
        tipperPk: user2.publicKey,
        amount: tippedAmount,
        signer: user2,
      }),
    ).rejects.toThrow();
  });

  test('User2 Close Tutorial1 and recreate a new one using nonce', async () => {
    await expect(
      proposalClose({
        program,
        mintPk: mintKafe,
        proposalId: 1,
        authorPk: user2.publicKey,
        userPk: user2.publicKey,
        signer: user2,
      }),
    ).resolves.toBeTruthy();
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);
    const nonce = daoAccount.nonce.toNumber();

    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mintKafe,
      mintBdrPk: mintBDR,
      proposalId: nonce,
      userPk: user2.publicKey,
      slug: slug2,
      streamId: streamId2,
      signer: user2,
    });
    proposalAccount = await getProposalAccountBySlug(program, slug2);
    expect(proposalAccount.id.toNumber()).toBe(2);
  });

  test('Proposal Set creator test', async () => {
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);
    const nonce = daoAccount.nonce.toNumber();
    const balance0 = await provider.connection.getBalance(user2.publicKey);
    const tokenBalance0 = await provider.connection.getTokenAccountBalance(
      user2Ata.address,
    );
    const tokenAmount0 = parseInt(tokenBalance0.value.amount);

    await proposalCreate({
      program,
      mintPk: mintKafe,
      mintBdrPk: mintBDR,
      proposalId: nonce,
      userPk: superAdmin.publicKey,
      slug: 'i-am-a-slug-stuff',
      streamId:
        'kjzl6cwe1jw149hl95f35wz2z861uw6yxm4iyc29bhpyx726wy59t8hpbqow26h',
      signer: superAdmin,
    });

    await proposalSetState({
      program: program,
      proposalId: nonce,
      adminPk: auth1.publicKey,
      newState: ProposalStateE.published,
      signer: auth1,
    });

    for (let i = 0; i < 10; i++) {
      await guideTipping({
        program,
        mintKafe,
        mintBDR,
        proposalId: nonce,
        tipperPk: user1.publicKey,
        amount: new anchor.BN(1_000_000),
        signer: user1,
      });
    }

    await proposalSetCreator({
      program,
      proposalId: nonce,
      mintKafePk: mintKafe,
      mintBDRPk: mintBDR,
      creatorPk: user2.publicKey,
      authorityKp: superAdmin,
    });

    const balance = await provider.connection.getBalance(user2.publicKey);
    const tokenBalance = await provider.connection.getTokenAccountBalance(
      user2Ata.address,
    );
    const tokenAmount = parseInt(tokenBalance.value.amount);

    expect(balance - balance0).toBe(7_000_000);
    expect(tokenAmount - tokenAmount0).toBe(2_000_000);

    const proposalAccount = await getProposalAccountById(
      program,
      pdaProposalById,
      nonce,
    );

    expect(proposalAccount.creator.toString()).toBe(user2.publicKey.toString());
  });

  test('User1 Close Tutorial0', async () => {
    await expect(
      proposalClose({
        program,
        mintPk: mintKafe,
        proposalId: 0,
        authorPk: user1.publicKey,
        userPk: user1.publicKey,
        signer: user1,
      }),
    ).resolves.toBeTruthy();
  });

  test('Close Kafe Vault.', async () => {
    const pdaVaultKafe = await pdaDaoVaultAccount(mintKafe);
    let vaultBalance = await provider.connection.getTokenAccountBalance(
      pdaVaultKafe.pda,
    );
    let vaultAmount = new anchor.BN(parseInt(vaultBalance.value.amount));
    await daoVaultClose({
      program,
      mintPk: mintKafe,
      amount: vaultAmount,
      superAdminPk: superAdmin.publicKey,
      signer: superAdmin,
    });
    vaultBalance = await provider.connection.getTokenAccountBalance(
      superAdminAta.address,
    );
    // console.log('>>>>', vaultBalance.value.uiAmount);
  });

  test('Close BDR Vault.', async () => {
    const pdaVaultBDR = await pdaDaoVaultAccount(mintBDR);
    let vaultBalance = await provider.connection.getTokenAccountBalance(
      pdaVaultBDR.pda,
    );
    let vaultAmount = new anchor.BN(parseInt(vaultBalance.value.amount));
    const bb = await provider.connection.getBalance(superAdmin.publicKey);

    await daoVaultClose({
      program,
      mintPk: mintBDR,
      amount: vaultAmount,
      superAdminPk: superAdmin.publicKey,
      freeze: true,
      signer: superAdmin,
    });
    vaultBalance = await provider.connection.getTokenAccountBalance(
      superAdminAtaBDR.address,
    );
  });

  test('Close DaoAccount.', async () => {
    await expect(
      daoClose({
        program,
        superAdminPk: superAdmin.publicKey,
        signer: superAdmin,
      }),
    ).resolves.toBeTruthy();
  });
});
