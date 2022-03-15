import { logDebug } from './utils/index';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import {
  daoAccount as getDaoAccount,
  daoVaultAccountBalance as getDaoVaultAccountBalance,
  proposalAccountBySlug as getProposalAccountBySlug,
  reviewerAccountByReviewerPK as getReviewerAccount,
  userVoteAccountById as getUserVoteAccountById,
  listOfVoterById as getListOfVoterById,
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
} from '../ts-sdk/lib/instructions';

import { ProposalStateE } from '../ts-sdk';

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

  let user1 = anchor.web3.Keypair.generate();
  let user1Ata: anchor.web3.PublicKey;

  let user2 = anchor.web3.Keypair.generate();
  let user2Ata: anchor.web3.PublicKey;
  let mintAuth = anchor.web3.Keypair.generate();

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
    logDebug('mint created');
  });

  test('create userATAs', async () => {
    // create  associated token account
    user1Ata = await mint.createAssociatedTokenAccount(user1.publicKey);
    logDebug('user1Ata created');

    user2Ata = await mint.createAssociatedTokenAccount(user2.publicKey);
    logDebug('user2Ata created');

    // Mint tokens to token account
    await mint.mintTo(user1Ata, mintAuth.publicKey, [mintAuth], 2_500_000);
    logDebug('minted to user1');
    await mint.mintTo(user2Ata, mintAuth.publicKey, [mintAuth], 1_500_000);
    logDebug('minted to user2');

    const userAta = await getAta(user1.publicKey, mint.publicKey);
    expect(user1Ata.toString()).toBe(userAta.toString());
  });

  test('Initialize daoAccount and daoVault', async () => {
    const quorum = new anchor.BN(100);
    const response = await daoInitialize({
      program,
      mintPk: mint.publicKey,
      admins: [auth1.publicKey, auth2.publicKey],
      payerPk: auth1.publicKey,
      quorum,
      signer: auth1,
    });
    logDebug(response);

    const { pdaDaoAccount, pdaDaoVaultAccount } = getPda(
      program.programId,
      mint.publicKey,
    );
    const daoAccount = await getDaoAccount(program, pdaDaoAccount);

    logDebug(daoAccount);
    expect(daoAccount.mint.toString()).toBe(mint.publicKey.toString());
    expect(daoAccount.quorum.toNumber()).toBe(quorum.toNumber());
    expect(daoAccount.admins.length).toBe(2);
    expect(daoAccount.minAmountToCreateProposal.toNumber()).toBe(
      new anchor.BN(1_000_000).toNumber(),
    );

    const daoVaultAccountBalance = await getDaoVaultAccountBalance(
      provider,
      pdaDaoVaultAccount,
    );
    logDebug(daoVaultAccountBalance);

    expect(daoVaultAccountBalance.amount).toBe(0);
    expect(daoVaultAccountBalance.decimals).toBe(6);
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
    const slug = 'delpoy-a-polkadot-smart-contract';
    const streamId =
      'k3y52l7mkcvtg023bt9txegccxe1bah8os3naw5asinf3l3t54atn0cuy98yws';
    const response = await proposalCreate({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      slug,
      streamId,
      signer: user1,
    });
    logDebug(response);
    const proposalAccount = await getProposalAccountBySlug(program, slug);
    logDebug(proposalAccount);
    expect(proposalAccount.id.toNumber()).toBe(0);
    expect(proposalAccount.creator.toString()).toBe(user1.publicKey.toString());
    expect(proposalAccount.numberOfVoter.toNumber()).toBe(0);
    expect(proposalAccount.slug).toBe(slug);
    expect(proposalAccount.streamId).toBe(streamId);
    expect(Object.keys(proposalAccount.state)[0]).toBe('submitted');
  });

  test('User1 Cast a Vote on Tutorial0', async () => {
    const response = await voteCast({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      signer: user1,
    });
    logDebug(response);
    const { pdaUserVoteAccountById } = getPda(
      program.programId,
      mint.publicKey,
    );
    let voteAccount = await getUserVoteAccountById(
      program,
      pdaUserVoteAccountById,
      user1.publicKey,
      0,
    );
    logDebug(voteAccount);
    expect(voteAccount.tutorialId.toNumber()).toBe(0);
    expect(voteAccount.author.toString()).toBe(user1.publicKey.toString());
    let listOfVoter = await getListOfVoterById(program, 0);
    expect(listOfVoter).toHaveLength(1);
  });

  it('User1 Cancel a Vote on Tutorial0', async () => {
    const response = await voteCancel({
      program,
      mintPk: mint.publicKey,
      tutorialId: 0,
      userPk: user1.publicKey,
      signer: user1,
    });
    logDebug(response);
    let listOfVoter = await getListOfVoterById(program, 0);
    expect(listOfVoter).toHaveLength(0);
  });

  test('Create a reviewer', async () => {
    const githubName1 = 'zurgl';
    const githubName2 = 'Neco';
    await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer2.publicKey,
      githubName: githubName1,
      signer: auth1,
    });
    const response = await reviewerCreate({
      program: program,
      mintPk: mint.publicKey,
      adminPk: auth1.publicKey,
      reviewerPk: reviewer1.publicKey,
      githubName: githubName2,
      signer: auth1,
    });
    logDebug(response);

    const { pdaReviewerAccount } = getPda(program.programId, mint.publicKey);
    const reviewerAccount: any = await getReviewerAccount(
      program,
      pdaReviewerAccount,
      reviewer1.publicKey,
    );
    logDebug(reviewerAccount);
    expect(reviewerAccount.pubkey.toString()).toBe(
      reviewer1.publicKey.toString(),
    );
    expect(reviewerAccount.numberOfAssignment).toBe(0);
    expect(reviewerAccount.github_name).not.toBe(githubName1);
  });

  test('Delete a reviewer', async () => {
    const response = await reviewerDelete({
      program,
      mintPk: mint.publicKey,
      reviewerPk: reviewer1.publicKey,
      adminPk: auth1.publicKey,
      signer: auth1,
    });
    logDebug(response);
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
      ProposalStateE.hasReviewers,
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
      logDebug(proposalAccount);
      expect(Object.keys(proposalAccount.state)[0]).toBe(state);
    }
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
  const CREATOR_WEIGHT = 70 / 100;
  const REVIEWER_WEIGHT = 15 / 100;

  // Initial balance of actors
  const initialTipperBalance = await provider.connection.getBalance(user2.publicKey) 
  const initialCreatorBalance = await provider.connection.getBalance(user1.publicKey) 
  const initialReviewer1Balance = await provider.connection.getBalance(reviewer1.publicKey) 
  const initialReviewer2Balance = await provider.connection.getBalance(reviewer2.publicKey) 

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
  const finalTipperBalance = await provider.connection.getBalance(user2.publicKey) 
  const finalCreatorBalance = await provider.connection.getBalance(user1.publicKey) 
  const finalReviewer1Balance = await provider.connection.getBalance(reviewer1.publicKey) 
  const finalReviewer2Balance = await provider.connection.getBalance(reviewer2.publicKey) 

  // Basic check
  expect(initialTipperBalance - finalTipperBalance).toBe(tippedAmount.toNumber());  
  expect(finalCreatorBalance - initialCreatorBalance).toBe(CREATOR_WEIGHT * tippedAmount.toNumber());  
  expect(finalReviewer1Balance - initialReviewer1Balance).toBe(REVIEWER_WEIGHT * tippedAmount.toNumber());  
  expect(finalReviewer2Balance - initialReviewer2Balance).toBe(REVIEWER_WEIGHT * tippedAmount.toNumber());  
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
