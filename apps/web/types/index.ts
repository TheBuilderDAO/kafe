import { TutorialMetadata } from '@builderdao/apis/src/CeramicApi';

export type Tutorial = {
  id: number;
  slug: string;
  state: string;
  createdAt: number;
  creator: string;
  reviewer1: string;
  reviewer2: string;
  streamId: string;
} & TutorialMetadata;

export enum TutorialState {
  Proposed = 'proposed',
  InWriting = 'in_writing',
}

export type TutorialIndex = {
  objectID: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  state: string;
  tags: string[];
  difficulty: string;
  numberOfVotes: number;
  lastUpdatedAt: number;
  totalTips: number;
};

export enum ArweaveTransactionStatus {
  NOT_CONFIRMED,
  CONFIRMED,
}

export type ArweaveTutorialTags = {
  'App-Name': string;
  'Content-Type': string;
  Address: string;
};
