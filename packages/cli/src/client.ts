/* eslint-disable @typescript-eslint/no-unused-vars */
import * as anchor from '@project-serum/anchor';
import {
  TutorialProgramClient,
  TutorialProgramConfig,
} from '@builderdao-sdk/dao-program';

export const getClient = ({
  payer,
  network = TutorialProgramConfig.Network.TESTNET,
  kafePk = new anchor.web3.PublicKey(
    'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
  ),
  bdrPk = new anchor.web3.PublicKey(
    'BDR3oUcZLRQtufDahJskbsxwTvfWt9jiZkJPVr4kUQg2',
  ),
}: {
  payer: anchor.web3.Keypair;
  network?: TutorialProgramConfig.Network;
  kafePk?: anchor.web3.PublicKey;
  bdrPk?: anchor.web3.PublicKey;
}) => {
  const connection = new anchor.web3.Connection(
    TutorialProgramConfig.getClusterUrl(network),
    'confirmed',
  );
  const wallet = new anchor.Wallet(payer);

  return new TutorialProgramClient(
    connection,
    wallet,
    kafePk, bdrPk,
  );
};
