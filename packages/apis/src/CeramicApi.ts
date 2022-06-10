import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import KeyDidResolver from 'key-did-resolver';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { fromString } from 'uint8arrays/from-string';

export type TutorialContent = {
  name: string;
  path: string;
  digest: string;
  arweaveHash?: string;
};

export type TutorialMetadata = {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  tags: string[];
  publishedUri?: string;
  createdAt: number;
  content?: { [filename: string]: TutorialContent };
};

export type ApiConfig = {
  nodeUrl: string;
};

class CeramicApi {
  public authenticatedDid: string | undefined;

  private seed: string | undefined;

  private readonly client: CeramicClient;

  constructor(config: ApiConfig) {
    this.client = new CeramicClient(config.nodeUrl);
  }

  setSeed(seed: string) {
    this.seed = seed;
  }

  private async ensureAppAuthenticated() {
    if (!this.client.did?.authenticated) {
      await this.authenticateApp();
    }
  }

  async authenticateApp(): Promise<string> {
    if (!this.seed) {
      throw new Error('Seed not provided');
    }
    const resolver = {
      ...KeyDidResolver.getResolver(),
    };
    this.client.did = new DID({ resolver });

    const seed = fromString(this.seed, 'base58btc');
    const slicedSeed = seed.slice(0, 32);
    const provider = new Ed25519Provider(slicedSeed);

    this.client.did.setProvider(provider);

    this.authenticatedDid = await this.client.did.authenticate();

    return this.authenticatedDid;
  }

  async getMetadata(streamId: string): Promise<TutorialMetadata> {
    const doc = await TileDocument.load<TutorialMetadata>(
      this.client,
      streamId,
    );
    return doc.content;
  }

  async storeMetadata(metadata: TutorialMetadata) {
    await this.ensureAppAuthenticated();

    return TileDocument.create(this.client, metadata);
  }

  async updateMetadata(streamId: string, metadata: Partial<TutorialMetadata>) {
    await this.ensureAppAuthenticated();

    const doc = await TileDocument.load<Partial<TutorialMetadata>>(
      this.client,
      streamId,
    );

    return doc.update(metadata);
  }
}

export default CeramicApi;
