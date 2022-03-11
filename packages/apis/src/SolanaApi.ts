import { Connection, PublicKey } from '@solana/web3.js';
import {
  TutorialProgramClient,
  TutorialProgramConfig,
} from '@builderdao-sdk/dao-program';
import { Wallet } from '@project-serum/anchor';

export type ApiConfig = {
  connection: Connection;
  wallet: Wallet;
  network: TutorialProgramConfig.Network;
  kafeMint: PublicKey;
};

class SolanaApi {
  public readonly tutorialProgram: TutorialProgramClient;

  constructor(config: ApiConfig) {
    this.tutorialProgram = new TutorialProgramClient(
      config.connection,
      config.wallet,
      config.kafeMint,
    );
  }
}

export default SolanaApi;
