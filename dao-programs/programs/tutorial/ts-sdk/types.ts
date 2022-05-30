import { IdlAccounts, IdlTypes, web3 } from '@project-serum/anchor';
import { Tutorial } from './lib/idl/tutorial';

export type ReviewerAccount = IdlAccounts<Tutorial>['reviewerAccount'];
export type DaoAccount = IdlAccounts<Tutorial>['daoAccount'];
export type ProposalAccount = IdlAccounts<Tutorial>['proposalAccount'];
export type TipperAccount = IdlAccounts<Tutorial>['tipperAccount'];
export type VoteAccount = IdlAccounts<Tutorial>['voteAccount'];

export type ProposalState = IdlTypes<Tutorial>['ProposalState'];

export type AccountResult<T> = {
  account: T;
  publicKey: web3.PublicKey;
};
