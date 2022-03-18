const anchor = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// anchor deploy --provider.cluster testnet
// anchor migrate --provider.cluster testnet
// DkDLANn2cCG7q557VA5ieicUQQYDnZsexgDrRZgcXRQX
module.exports = async function (provider) {
  console.log('Deploying anchor...', provider);
  anchor.setProvider(provider);
  let program = anchor.workspace.Tutorial;

  let PROGRAM_SEED = 'BuilderDAO';

  let mint = new anchor.web3.PublicKey(
    'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
  );

  let authorities = [
    ...[provider.wallet.payer.publicKey.toString()],
    'Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy',
    '5uKXYaHes21BoBN3EcNDf13EFqUybzirLwSUfSF218As',
    '9Gaovv3PatKvTLUDLLMqCj2CYaB4rAnXm4nziVfmjovT',
    '9c8oxENj8XrEM2EMadxUoifZgB1Vbc8GEYqKTxTfPo3i',
    'B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv',
    '8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU',
    'HtdezEbemuLpAh9no1jp7Eezy8drWcbFuk3VPhs17bM4',
    'githDLGadJhMkAGPGoAiNMLA8HWdV9BTrNvpmU3Jz6n',
  ].map(pk => new anchor.web3.PublicKey(pk));

  let [daoConfig, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED)],
    program.programId,
  );

  let [daoVault] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROGRAM_SEED), mint.toBuffer()],
    program.programId,
  );

  console.log({
    walletPk: provider.wallet.payer.publicKey.toString(),
    bump: bump,
    daoAccount: daoConfig.toString(),
    daoVault: daoVault.toString(),
    mintPk: mint.toString(),
    authorities: authorities.slice(0, 2).map(pk => pk.toString()),
  });

  const quorum = new anchor.BN(2);

  let signature = await program.rpc.daoInitialize(bump, quorum, authorities, {
    accounts: {
      daoConfig,
      daoVault,
      mint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      payer: provider.wallet.payer.publicKey,
    },
  });

  console.log(`Creation of daoAccount: ${daoConfig.toString()}`);
  console.log(`Creation of daoVaultAccount: ${daoVault.toString()}`);
  console.log('signature', signature);

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
          daoConfig,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          authority: provider.wallet.payer.publicKey,
        },
      },
    );

    console.log('Creation of reviewer:', reviewer.name);
  }

  const proposals = await program.account.proposalAccount.all();
  console.log(proposals);
};
