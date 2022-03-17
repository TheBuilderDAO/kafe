import * as anchor from '@project-serum/anchor';

export interface DaoAccountT {
  bump: number;
  mint: anchor.web3.PublicKey;
  quorum: anchor.BN;
  minAmountToCreateProposal: anchor.BN;
  numberOfTutorial: anchor.BN;
  admins: anchor.web3.PublicKey[];
}

export type DaoVaultAccountBalanceT = {
  amount: number | null;
  decimals: number;
};

export enum ProposalStateE {
  Submitted = 'submitted',
  Funded = 'funded',
  Writing = 'writing',
  ReadyToPublish = 'readyToPublish',
  Published = 'published',
}

export interface ProposalAccountT {
  id: anchor.BN;
  bump: number;
  creator: anchor.web3.PublicKey;
  reviewer1: anchor.web3.PublicKey;
  reviewer2: anchor.web3.PublicKey;
  numberOfVoter: anchor.BN;
  createdAt: anchor.BN;
  // TO DO LATER
  state: any;
  slug: string;
  streamId: string;
}

export interface VoteAccountT {
  bump: number;
  tutorialId: anchor.BN;
  author: anchor.web3.PublicKey;
  votedAt: anchor.web3.PublicKey;
}

export interface ReviewerAccountT {
  bump: number;
  pubkey: anchor.web3.PublicKey;
  numberOfAssignment: number;
  githubName: String;
}
