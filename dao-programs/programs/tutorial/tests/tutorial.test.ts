/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable jest/expect-expect */
// import { logDebug } from './utils/index';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
// coucou
import {
  daoAccount as getDaoAccount,
  daoVaultAccountBalance as getDaoVaultAccountBalance,
  proposalAccountBySlug as getProposalAccountBySlug,
  proposalAccountById as getProposalAccountById,
  proposalAccountByStreamId as getProposalAccountByStreamId,
  reviewerAccountByReviewerPK as getReviewerAccount,
  reviewerAccountByGithubLogin as getReviewerAccountByGithubLogin,
  userVoteAccountById as getUserVoteAccountById,
  listOfVoterById as getListOfVoterById,
  tipperAccountsListById as getTipperAccountsListById,
} from '../ts-sdk/lib/fetchers';

import { Tutorial } from '../ts-sdk/lib/idl/tutorial';
import {
  daoInitialize,
  daoAddAdmin,
  daoRemoveAdmin,
  daoSetAmountToCreateProposal,
  daoSetQuorum,
  proposalClose,
  proposalCreate,
  voteCast,
  voteCancel,
  reviewerAssign,
  reviewerCreate,
  reviewerDelete,
  proposalSetState,
  guideTipping,
  proposalPublish,
} from '../ts-sdk/lib/instructions';

import { filterProposalByState, ProposalStateE } from '../ts-sdk';

import { airdrops, getAta } from '../ts-sdk/lib/utils';
import { getPda } from '../ts-sdk/lib/pda';

describe('tutorial-program', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Tutorial as Program<Tutorial>;
  console.log('PROGRAM ID', program.programId.toString());

  // Declare our Mint & authority & user
  let auth1 = anchor.web3.Keypair.generate();
  let auth2 = anchor.web3.Keypair.generate();

  let reviewer1 = anchor.web3.Keypair.generate();
  let reviewer2 = anchor.web3.Keypair.generate();
  let reviewer3 = anchor.web3.Keypair.generate();
  let reviewer1Ata: anchor.web3.PublicKey;
  let reviewer2Ata: anchor.web3.PublicKey;
  let reviewer3Ata: anchor.web3.PublicKey;

  let user1 = anchor.web3.Keypair.generate();
  let user1Ata: anchor.web3.PublicKey;

  let user2 = anchor.web3.Keypair.generate();
  let user2Ata: anchor.web3.PublicKey;
  let mintAuth = anchor.web3.Keypair.generate();

  const slug1 = 'delpoy-a-polkadot-smart-contract';
  const streamId1 =
    'kjzl6cwe1jw145i2z2cd6aedcwzcs3p3buecsoel5mzmitc6g8z0ccj9sbcmdmw';

  const slug2 = 'near-101';
  const streamId2 =
    'kjzl6cwe1jw149hl95f35wz2z861uw6yxm4iyc29bhpyx726wy59t8hpbqow26h';

  let mint: Token;
  const decimals = 6;

  test('Setup env', async () => {
    await airdrops(provider, [
      auth1,
      auth2,
      user1,
      user2,
      mintAuth,
      reviewer1,
      reviewer2,
      reviewer3,
    ]);

    // Create mint
    mint = await Token.createMint(
      provider.connection,
      mintAuth,
      mintAuth.publicKey,
      null,
      decimals,
      TOKEN_PROGRAM_ID,
    );
    expect(mint).toBeTruthy();
  });

  test('create userATAs', async () => {
    // create  associated token account
    user1Ata = await mint.createAssociatedTokenAccount(user1.publicKey);
    user2Ata = await mint.createAssociatedTokenAccount(user2.publicKey);
    reviewer1Ata = await mint.createAssociatedTokenAccount(reviewer1.publicKey);
    reviewer2Ata = await mint.createAssociatedTokenAccount(reviewer2.publicKey);
    reviewer3Ata = await mint.createAssociatedTokenAccount(reviewer3.publicKey);

    // Mint tokens to token account
    await mint.mintTo(user1Ata, mintAuth.publicKey, [mintAuth], 2_500_000);
    await mint.mintTo(user2Ata, mintAuth.publicKey, [mintAuth], 1_500_000);
    await mint.mintTo(reviewer1Ata, mintAuth.publicKey, [mintAuth], 1_000_000);
    await mint.mintTo(reviewer2Ata, mintAuth.publicKey, [mintAuth], 1_000_000);
    await mint.mintTo(reviewer3Ata, mintAuth.publicKey, [mintAuth], 1_000_000);

    const userAta = await getAta(user1.publicKey, mint.publicKey);
    expect(user1Ata.toString()).toBe(userAta.toString());
  });

  test('Initialize daoAccount and daoVault', async () => {
    const quorum = new anchor.BN(100);
    await daoInitialize({
      program,
      mintPk: mint.publicKey,
      admins: [auth1.publicKey, auth2.publicKey],
      payerPk: auth1.publicKey,
      quorum,
      signer: auth1,
    });

    const { pdaDaoAccount, pdaDaoVaultAccount } = getPda(
      program.programId,
      mint.publicKey,
    );
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);

    expect(daoAccount.mint.toString()).toBe(mint.publicKey.toString());
    expect(daoAccount.quorum.toNumber()).toBe(quorum.toNumber());
    expect(daoAccount.admins.length).toBe(2);
    expect(daoAccount.nonce.toNumber()).toBe(0);
    expect(daoAccount.numberOfTutorial.toNumber()).toBe(0);
    expect(daoAccount.minAmountToCreateProposal.toNumber()).toBe(
      new anchor.BN(1_000_000).toNumber(),
    );

    let daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(0);
    expect(daoVaultAccountBalance.decimals).toBe(6);

    const pdaVaultKafe = (await pdaDaoVaultAccount()).pda;
    await mint.mintTo(pdaVaultKafe, mintAuth.publicKey, [mintAuth], 10 ** 12);

    daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      pdaDaoVaultAccount,
    );

    expect(daoVaultAccountBalance.amount).toBe(10 ** 6);
  });

  test('Dao Account setter', async () => {
    let daoAccount;
    const { pdaDaoAccount } = getPda(program.programId, mint.publicKey);

    await daoAddAdmin({
      program,
      mintPk: mint.publicKey,
      userPk: user1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.admins.length).toBe(3);

    await daoRemoveAdmin({
      program,
      mintPk: mint.publicKey,
      userPk: user1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.admins.length).toBe(2);

    await daoSetQuorum({
      program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      quorum: new anchor.BN(10),
      signer: auth1,
    });
    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.quorum.toNumber()).toBe(10);

    await daoSetAmountToCreateProposal({
      program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      amount: new anchor.BN(1_500_000),
      signer: auth1,
    });

    daoAccount = await getDaoAccount(program, pdaDaoAccount);
    expect(daoAccount.minAmountToCreateProposal.toNumber()).toBe(1_500_000);
  });

  test('User1 Create a tutorial', async () => {
    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      slug: slug1,
      streamId: streamId1,
      signer: user1,
    });
    const { pdaTutorialById } = getPda(program.programId, mint.publicKey);
    proposalAccount = await getProposalAccountById(program, pdaTutorialById, 0);
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
    const { pdaDaoAccount } = getPda(program.programId, mint.publicKey);
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);
    const nonce = daoAccount.nonce.toNumber();

    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mint.publicKey,
      tutorialId: nonce,
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
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      signer: user1,
    });
    const { pdaUserVoteAccountById } = getPda(
      program.programId,
      mint.publicKey,
    );
    const voteAccount = await getUserVoteAccountById(
      program,
      pdaUserVoteAccountById,
      user1.publicKey,
      0,
    );
    expect(voteAccount.tutorialId.toNumber()).toBe(0);
    expect(voteAccount.author.toString()).toBe(user1.publicKey.toString());
    const listOfVoter = await getListOfVoterById(program, 0);
    expect(listOfVoter).toHaveLength(1);
  });

  it('User1 Cancel a Vote on Tutorial0', async () => {
    await voteCancel({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      signer: user1,
    });
    const listOfVoter = await getListOfVoterById(program, 0);
    expect(listOfVoter).toHaveLength(0);
  });

  test('Create a reviewer', async () => {
    const githubName1 = 'zurgl';
    const githubName2 = 'Neco';
    let reviewerAccount: any;
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer2.publicKey,
      githubName: githubName1,
      signer: auth1,
    });
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer1.publicKey,
      githubName: githubName2,
      signer: auth1,
    });

    const { pdaReviewerAccount } = getPda(program.programId, mint.publicKey);
    reviewerAccount = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      reviewer1.publicKey,
    );
    expect(reviewerAccount.pubkey.toString()).toBe(
      reviewer1.publicKey.toString(),
    );
    expect(reviewerAccount.numberOfAssignment).toBe(0);
    expect(reviewerAccount.github_name).not.toBe(githubName1);

    reviewerAccount = await getReviewerAccountByGithubLogin(
      program,
      githubName1,
    );
    expect(reviewerAccount.github_name).not.toBe(githubName1);
  });

  test('Delete a reviewer', async () => {
    await reviewerDelete({
      program,
      mintPk: mint.publicKey,
      reviewerPk: reviewer1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    const { pdaReviewerAccount } = getPda(program.programId, mint.publicKey);
    await expect(
      getReviewerAccount(program, pdaReviewerAccount, reviewer1.publicKey),
    ).rejects.toThrow();
    const githubName1 = 'zurgl';
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer1.publicKey,
      githubName: githubName1,
      signer: auth1,
    });
  });

  test('Reviewer: Creator cannot be a reviewer', async () => {
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: user1.publicKey,
      githubName: 'user1',
      signer: auth1,
    });
    await expect(
      reviewerAssign({
        program: program,
        mintPk: mint.publicKey,
        adminPk: auth1.publicKey,
        reviewer1Pk: user1.publicKey,
        reviewer2Pk: reviewer2.publicKey,
        tutorialId: 0,
        signer: auth1,
      }),
    ).rejects.toThrow();
  });

  test('Reviewer: Force assignment for user2 on tutorial 1', async () => {
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: user2.publicKey,
      githubName: 'user2',
      signer: auth1,
    });
    await reviewerAssign({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewer1Pk: user2.publicKey,
      reviewer2Pk: user2.publicKey,
      tutorialId: 1,
      force: true,
      signer: auth1,
    });

    const { pdaReviewerAccount } = getPda(program.programId, mint.publicKey);
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
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewer1Pk: reviewer1.publicKey,
      reviewer2Pk: reviewer2.publicKey,
      tutorialId: 0,
      signer: auth1,
    });

    const { pdaReviewerAccount } = getPda(program.programId, mint.publicKey);
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
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer3.publicKey,
      githubName: 'Yash',
      signer: auth1,
    });
    await expect(
      reviewerCreate({
        program: program,
        mintPk: mint.publicKey,
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
        mintPk: mint.publicKey,
        tutorialId: 0,
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
        mintPk: mint.publicKey,
        tutorialId: 0,
        adminPk: auth1.publicKey,
        // @ts-ignore
        newState: invalidState,
        signer: auth1,
      }),
    ).rejects.toThrow();
  });

  test('user2 tip a tutorial', async () => {
    // Amount to tip in LAMPORT
    const tippedAmount = new anchor.BN(1_000_000);
    const tippingCost = new anchor.BN(1_287_600);

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

    // Tipping instruction
    await guideTipping({
      program,
      mintPk: mint.publicKey,
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

  test('user2 tip again the same guide', async () => {
    await guideTipping({
      program,
      mintPk: mint.publicKey,
      proposalId: 0,
      tipperPk: user2.publicKey,
      amount: new anchor.BN(1_000_000),
      signer: user2,
    });
    const tipperInfo = await getTipperAccountsListById(program, 0);
    expect(tipperInfo[0].account.amount.toNumber()).toBe(2_000_000);
  });

  test('reviewer3 tip the guide', async () => {
    await guideTipping({
      program,
      mintPk: mint.publicKey,
      proposalId: 0,
      tipperPk: reviewer3.publicKey,
      amount: new anchor.BN(1_000_000),
      signer: reviewer3,
    });
    const tipperInfo = await getTipperAccountsListById(program, 0);
    expect(tipperInfo.length).toBe(2);
  });

  test('user2 tip too  much', async () => {
    // Amount to tip in LAMPORT
    const tippedAmount = new anchor.BN(1_000_000_000);

    // Tipping instruction
    await expect(
      guideTipping({
        program,
        mintPk: mint.publicKey,
        proposalId: 0,
        tipperPk: user2.publicKey,
        amount: tippedAmount,
        signer: user2,
      }),
    ).rejects.toThrow();
  });

  test('Publishing: user1 publish the guide', async () => {
    await proposalSetState({
      program: program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      adminPk: auth1.publicKey,
      newState: ProposalStateE.readyToPublish,
      signer: auth1,
    });
    let tokenAmount = await provider.connection.getTokenAccountBalance(
      user1Ata,
    );
    await proposalPublish({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      adminPk: auth1.publicKey,
      authorPk: user1.publicKey,
      signer: auth1,
    });
    tokenAmount = await provider.connection.getTokenAccountBalance(user1Ata);
    expect(tokenAmount.value.amount).toBe('2000000');
  });

  test('User2 Close Tutorial1 and recreate a new one using nonce', async () => {
    await expect(
      proposalClose({
        program,
        mintPk: mint.publicKey,
        tutorialId: 1,
        userPk: user2.publicKey,
        signer: user2,
      }),
    ).resolves.toBeTruthy();
    const { pdaDaoAccount } = getPda(program.programId, mint.publicKey);
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);
    const nonce = daoAccount.nonce.toNumber();

    let proposalAccount: any;
    await proposalCreate({
      program,
      mintPk: mint.publicKey,
      tutorialId: nonce,
      userPk: user2.publicKey,
      slug: slug2,
      streamId: streamId2,
      signer: user2,
    });
    proposalAccount = await getProposalAccountBySlug(program, slug2);
    expect(proposalAccount.id.toNumber()).toBe(2);
  });

  test('User1 Close Tutorial0', async () => {
    await expect(
      proposalClose({
        program,
        mintPk: mint.publicKey,
        tutorialId: 0,
        userPk: user1.publicKey,
        signer: user1,
      }),
    ).resolves.toBeTruthy();
  });
});
