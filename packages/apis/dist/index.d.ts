import { TileDocument } from '@ceramicnetwork/stream-tile';
import { Connection, PublicKey } from '@solana/web3.js';
import { TutorialProgramClient, TutorialProgramConfig } from '@builderdao-sdk/dao-program';
import { Wallet } from '@project-serum/anchor';

declare type TutorialIndex = {
    objectID: string;
    title: string;
    slug: string;
    description: string;
    author: string;
    state: string;
    tags: string[];
    difficulty: string;
    numberOfVotes: number;
};
declare type ApiConfig$3 = {
    appId: string;
    accessKey: string;
    indexName: string;
};
declare class AlgoliaApi {
    private client;
    private index;
    constructor(config: ApiConfig$3);
    createTutorial(record: Partial<TutorialIndex>): Promise<void>;
    updateNumberOfVotes(objectID: string, numberOfVotes: number): Promise<void>;
    publishTutorial(objectID: string, state: any): Promise<void>;
}

declare type ApiConfig$2 = {
    appName: string;
    host?: string;
    port?: number;
    protocol?: string;
};
declare enum TransactionStatus {
    NOT_CONFIRMED = 0,
    CONFIRMED = 1
}
declare type TutorialTags = {
    'App-Name': string;
    'Content-Type': string;
    Address: string;
};
declare class ArweaveApi {
    private readonly appName;
    private client;
    private static ARWEAVE_REQUIRED_CONFIRMATIONS;
    constructor(config: ApiConfig$2);
    publishTutorial(data: string, address: string, wallet: string): Promise<string>;
    getTutorialByHash(transactionHash: string): Promise<{
        id: string;
        data: string;
        status: TransactionStatus;
        timestamp: number | undefined;
        tags: TutorialTags;
    } | {
        id: string;
        data: string;
        status: TransactionStatus;
        timestamp?: undefined;
        tags?: undefined;
    }>;
}

declare type TutorialMetadata = {
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    tags: string[];
    publishedUri?: string;
    content: {
        [filename: string]: {
            name: string;
            path: string;
            digest: string;
        };
    };
};
declare type ApiConfig$1 = {
    nodeUrl: string;
    seed?: string;
};
declare class CeramicApi {
    authenticatedDid: string | undefined;
    private readonly seed;
    private readonly client;
    constructor(config: ApiConfig$1);
    private ensureAppAuthenticated;
    authenticateApp(): Promise<string>;
    getMetadata(streamId: string): Promise<TutorialMetadata>;
    storeMetadata(metadata: TutorialMetadata): Promise<TileDocument<TutorialMetadata>>;
    updateMetadata(streamId: string, metadata: Partial<TutorialMetadata>): Promise<void>;
}

declare class GitHubApi {
    private client;
    constructor();
    triggerWorkflow(slug: string): Promise<void>;
}

declare type ApiConfig = {
    connection: Connection;
    wallet: Wallet;
    network: TutorialProgramConfig.Network;
    kafeMint: PublicKey;
};
declare class SolanaApi {
    readonly tutorialProgram: TutorialProgramClient;
    constructor(config: ApiConfig);
}

export { AlgoliaApi, ArweaveApi, CeramicApi, GitHubApi, SolanaApi };
