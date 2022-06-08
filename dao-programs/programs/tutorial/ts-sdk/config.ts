import { Cluster, clusterApiUrl, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

import idl from './lib/idl/tutorial.json';
import { Tutorial } from './lib/idl/tutorial';
import * as _ from 'lodash';

export namespace TutorialProgramConfig {
  /**
   * The Networks solana programs can be published.
   */
  export enum Network {
    MAINNET = 'mainnet-beta',
    DEVNET = 'devnet',
    TESTNET = 'testnet',
    LOCALNET = 'localnet',
  }

  // TODO: Try to auto generate populate this file.
  export const getConfig = (): {
    getProgram: (provider: anchor.Provider) => anchor.Program<Tutorial>;
    PROGRAM_ID: PublicKey;
  } => {
    if (_.isUndefined(idl.metadata.address)) {
      throw new Error(`Program is not deployed`);
    }
    const PROGRAM_ID = new PublicKey(idl.metadata.address);
    const getProgram = (
      provider: anchor.Provider,
    ): anchor.Program<Tutorial> => {
      return new anchor.Program(idl as any, PROGRAM_ID, provider);
    };
    return {
      getProgram,
      PROGRAM_ID,
    };
  };

  export type ExtendedCluster = Cluster & 'localnet';

  export const getClusterUrl = (network: Network) => {
    switch (network) {
      case 'devnet':
      case 'mainnet-beta':
      case 'testnet':
        return clusterApiUrl(network);
      case 'localnet':
      default:
        return 'http://127.0.0.1:8899';
    }
  };
}
