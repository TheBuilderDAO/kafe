import { Connection, PublicKey } from '@solana/web3.js';
import {
  TutorialProgramClient,
  TutorialProgramConfig,
} from '@builderdao/program-tutorial';
import { Wallet } from '@project-serum/anchor';

export type ApiConfig = {
  connection: Connection;
  wallet: Wallet;
  network: TutorialProgramConfig.Network;
  kafeMint: PublicKey;
  bdrMint: PublicKey;
};

class SolanaApi {
  public readonly tutorialProgram: TutorialProgramClient;

  constructor(config: ApiConfig) {
    this.tutorialProgram = new TutorialProgramClient(
      config.connection,
      config.wallet,
      config.kafeMint,
      config.bdrMint,
    );
  }
}

export default SolanaApi;
