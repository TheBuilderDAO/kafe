import Arweave from 'arweave';
import { JWKPublicInterface } from 'arweave/node/lib/wallet';

export type ApiConfig = {
  appName: string;
  wallet: string;
  host?: string;
  port?: number;
  protocol?: string;
};

export enum TransactionStatus {
  NOT_CONFIRMED,
  CONFIRMED,
}

export type TutorialTags = {
  'App-Name': string;
  'Content-Type': string;
  Address: string;
};

class ArweaveApi {
  private readonly appName: string;

  private client: Arweave;

  private readonly wallet: JWKPublicInterface;

  private static ARWEAVE_REQUIRED_CONFIRMATIONS = 2;

  constructor(config: ApiConfig) {
    this.appName = config.appName;
    this.wallet = JSON.parse(config.wallet) as JWKPublicInterface;
    this.client = Arweave.init({
      host: config.host || 'localhost',
      port: config.port || 1984,
      protocol: config.protocol || 'http',
    });
  }

  async publishTutorial(data: string, address: string): Promise<string> {
    // Create Arweave transaction passing in data. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    const transaction = await this.client.createTransaction(
      { data },
      this.wallet,
    );

    // Add tags:
    // - App-Name - APP_NAME environmental variable
    // - Content-Type - Should be application/json
    // - Address - Address of a user
    // Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    transaction.addTag('App-Name', this.appName as string);
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('Address', address);

    // Sign Arweave transaction with your wallet. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    await this.client.transactions.sign(transaction, this.wallet);

    // Post Arweave transaction. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    await this.client.transactions.post(transaction);

    return transaction.id;
  }

  async getTutorialByHash(transactionHash: string) {
    // Get Arweave transaction data. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    const txDataResp = (await this.client.transactions.getData(
      transactionHash as string,
      {
        decode: true,
        string: true,
      },
    )) as string;
    const txData = JSON.parse(txDataResp);

    // Get Arweave transaction status. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
    const txStatusResp = await this.client.transactions.getStatus(
      transactionHash as string,
    );

    const txStatus =
      txStatusResp.status === 200 &&
      txStatusResp.confirmed &&
      txStatusResp.confirmed.number_of_confirmations >=
        ArweaveApi.ARWEAVE_REQUIRED_CONFIRMATIONS
        ? TransactionStatus.CONFIRMED
        : TransactionStatus.NOT_CONFIRMED;

    // We should show only confirmed transactions to avoid sniffing and claiming NFT
    if (txStatus === TransactionStatus.CONFIRMED) {
      // Get Arweave transaction block in order to retrieve timestamp. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
      const block = txStatusResp.confirmed
        ? await this.client.blocks.get(txStatusResp.confirmed.block_indep_hash)
        : null;

      // Get Arweave transaction. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
      const tx = await this.client.transactions.get(transactionHash as string);

      // Get Arweave transaction tags. Documentation can be found here: https://github.com/ArweaveTeam/arweave-js
      const tags = {} as TutorialTags;
      (tx.get('tags') as any).forEach((tag: any) => {
        const key: keyof TutorialTags = tag.get('name', {
          decode: true,
          string: true,
        });
        tags[key] = tag.get('value', { decode: true, string: true });
      });

      return {
        id: transactionHash as string,
        data: txData,
        status: txStatus,
        timestamp: block?.timestamp,
        tags,
      };
    }

    return {
      id: transactionHash as string,
      data: txData,
      status: txStatus,
    };
  }
}

export default ArweaveApi;
