const anchor = require('@project-serum/anchor');
const {
  TOKEN_PROGRAM_ID,
  setAuthority,
  AuthorityType,
  mintTo,
} = require('@solana/spl-token');
const { tokenAuth } = require('./secret');

// anchor deploy --provider.cluster testnet
// anchor migrate --provider.cluster testnet
// prg5qq3Tpr3mN8UgtVeqXYkp7QeFpHTb68ovzw2VwFp
module.exports = async function (provider) {
  // console.log('Deploying anchor...', provider);
  anchor.setProvider(provider);
  let program = anchor.workspace.Tutorial;

  let PROGRAM_SEED = 'BuilderDAO';

  let signature;

  let daoAccount = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED)],
    program.programId,
  );

  // Create the daoAccount
  let superAdmin = new anchor.web3.PublicKey(
    'waL5Z5LodiuKg6baWHf7myhD2tKHye8XoHERAQiJLGA',
  );
  let admins = [
    ...[provider.wallet.payer.publicKey.toString()],
    'Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy',
    '5uKXYaHes21BoBN3EcNDf13EFqUybzirLwSUfSF218As',
    '9Gaovv3PatKvTLUDLLMqCj2CYaB4rAnXm4nziVfmjovT',
    '9c8oxENj8XrEM2EMadxUoifZgB1Vbc8GEYqKTxTfPo3i',
    'B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv',
    '8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU',
    'HtdezEbemuLpAh9no1jp7Eezy8drWcbFuk3VPhs17bM4',
    'githDLGadJhMkAGPGoAiNMLA8HWdV9BTrNvpmU3Jz6n',
    'CCWaJNjXSZaBdAfYZ8NEQv2v2LEPDSnFZnsfYbfzZE5F',
    'waL5Z5LodiuKg6baWHf7myhD2tKHye8XoHERAQiJLGA',
  ].map(pk => new anchor.web3.PublicKey(pk));
  const quorum = new anchor.BN(2);
  const minAmountToCreateProposal = new anchor.BN(1_000_000);

  signature = await program.rpc.daoInitialize(
    daoAccount[1],
    quorum,
    minAmountToCreateProposal,
    superAdmin,
    admins,
    {
      accounts: {
        daoAccount: daoAccount[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        payer: provider.wallet.payer.publicKey,
      },
    },
  );
  console.log(`Creation of daoAccount: ${daoAccount[0].toString()}`);
  console.log(`signature: ${signature}`);

  // Create the default reviewer
  const defaultReviewer = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED), superAdmin.toBuffer()],
    program.programId,
  );
  const defaultReviewerLogin = 'sudo';
  signature = await program.rpc.reviewerCreate(
    defaultReviewer[1],
    superAdmin,
    defaultReviewerLogin,
    {
      accounts: {
        reviewerAccount: defaultReviewer[0],
        daoAccount: daoAccount[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        authority: provider.wallet.payer.publicKey,
      },
    },
  );

  // Create the Kafe Vault Account
  let kafeMint = new anchor.web3.PublicKey(
    'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
  );

  let daoKafeVault = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED), kafeMint.toBuffer()],
    program.programId,
  );

  signature = await program.rpc.daoVaultInitialize({
    accounts: {
      daoVault: daoKafeVault[0],
      mint: kafeMint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      payer: provider.wallet.payer.publicKey,
    },
  });
  console.log(`Creation of daoKafeVault: ${daoKafeVault[0].toString()}`);
  console.log(`signature: ${signature}`);

  // Create the BDR Vault Account
  let bdrMint = new anchor.web3.PublicKey(
    'BDR3oUcZLRQtufDahJskbsxwTvfWt9jiZkJPVr4kUQg2',
  );

  let daoBDRVault = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED), bdrMint.toBuffer()],
    program.programId,
  );

  signature = await program.rpc.daoVaultInitialize({
    accounts: {
      daoVault: daoBDRVault[0],
      mint: bdrMint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      payer: provider.wallet.payer.publicKey,
    },
  });
  console.log(`Creation of daoBDRVault: ${daoBDRVault[0].toString()}`);
  console.log(`signature: ${signature}`);

  // Transfer token and authority
  // Mint and Freeze authority for both token
  const vaultAmount = 10 ** 11;

  // Mint tokens to token account
  await mintTo(
    provider.connection,
    tokenAuth,
    kafeMint,
    daoKafeVault[0],
    tokenAuth.publicKey,
    vaultAmount,
  );

  await mintTo(
    provider.connection,
    tokenAuth,
    bdrMint,
    daoBDRVault[0],
    tokenAuth.publicKey,
    vaultAmount,
  );

  await setAuthority(
    provider.connection,
    tokenAuth,
    bdrMint,
    tokenAuth.publicKey,
    AuthorityType.FreezeAccount,
    daoBDRVault[0],
  );

  let reviewers = [
    {
      pk: new anchor.web3.PublicKey(
        'Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy',
      ),
      name: 'silentlight',
    },
    {
      pk: new anchor.web3.PublicKey(
        '5uKXYaHes21BoBN3EcNDf13EFqUybzirLwSUfSF218As',
      ),
      name: 'dgamboa',
    },
    {
      pk: new anchor.web3.PublicKey(
        '9Gaovv3PatKvTLUDLLMqCj2CYaB4rAnXm4nziVfmjovT',
      ),
      name: 'yash-sharma1',
    },
    {
      pk: new anchor.web3.PublicKey(
        '9c8oxENj8XrEM2EMadxUoifZgB1Vbc8GEYqKTxTfPo3i',
      ),
      name: 'pyr0gan',
    },
    {
      pk: new anchor.web3.PublicKey(
        'B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv',
      ),
      name: 'zurgl',
    },
    {
      pk: new anchor.web3.PublicKey(
        '8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU',
      ),
      name: 'Necmttn',
    },
    {
      pk: new anchor.web3.PublicKey(
        'HtdezEbemuLpAh9no1jp7Eezy8drWcbFuk3VPhs17bM4',
      ),
      name: 'vunderkind',
    },
  ];

  for (let reviewer of reviewers) {
    const [reviewerAccountPda, reviewerAccountBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(PROGRAM_SEED), reviewer.pk.toBuffer()],
        program.programId,
      );

    signature = await program.rpc.reviewerCreate(
      reviewerAccountBump,
      reviewer.pk,
      reviewer.name,
      {
        accounts: {
          reviewerAccount: reviewerAccountPda,
          daoAccount: daoAccount[0],
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          authority: provider.wallet.payer.publicKey,
        },
      },
    );

    console.log('Creation of reviewer:', reviewer.name);
  }
};
