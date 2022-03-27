import {
  Commitment,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

import {
  daoAccount,
  daoVaultAccountBalance,
  isAdmin,
  listOfVoterById,
  proposalAccountById,
  proposalAccountBySlug,
  proposalAccountList,
  reviewerAccountByReviewerPK,
  reviewerAccountByGithubLogin,
  reviewerAccountByReviewerAccountPDA,
  reviewerAccountList,
  userVoteAccountById,
  tipperAccountList,
  tipperAccountListByUser,
  tipperAccountsListById,
} from './lib/fetchers';

import {
  proposalClose,
  proposalCreate,
  reviewerAssign,
  reviewerCreate,
  reviewerDelete,
  voteCancel,
  voteCast,
  proposalSetState,
  guideTipping,
  proposalPublish,
} from './lib/instructions';

import { Tutorial } from './lib/idl/tutorial';
import { getPda } from './lib/pda';
import { TutorialProgramConfig } from './config';
import { ProposalStateE } from './lib/instructions/proposalSetState';

const providerOptions: { commitment: Commitment } = {
  commitment: 'processed',
};

export class TutorialProgramClient {
  public readonly provider: anchor.Provider;
  public readonly tutorialProgram: anchor.Program<Tutorial>;
  public readonly kafeMint: PublicKey;
  public readonly BdrMint: PublicKey;
  public readonly programId: PublicKey;

  private readonly pda;

  constructor(
    connection: Connection,
    wallet: anchor.Wallet,
    kafeMint: PublicKey,
    bdrMint: PublicKey,
  ) {
    this.provider = new anchor.Provider(connection, wallet, providerOptions);
    const { getProgram, PROGRAM_ID } = TutorialProgramConfig.getConfig();
    this.programId = PROGRAM_ID;
    this.tutorialProgram = getProgram(this.provider);
    this.kafeMint = kafeMint;
    this.BdrMint = bdrMint;
    this.pda = getPda(this.programId);
  }

  // Fetchers
  async getDaoAccount() {
    return daoAccount(this.tutorialProgram, this.pda.pdaDaoAccount);
  }

  async getNonce() {
    return (
      await daoAccount(this.tutorialProgram, this.pda.pdaDaoAccount)
    ).nonce.toNumber();
  }

  async getProposals(
    filter: Buffer | GetProgramAccountsFilter[] | undefined = undefined,
  ) {
    return proposalAccountList(this.tutorialProgram, filter);
  }

  async getIsAdmin() {
    return isAdmin(
      this.tutorialProgram,
      this.pda.pdaDaoAccount,
      this.provider.wallet.publicKey,
    );
  }

  async getReviewers() {
    return reviewerAccountList(this.tutorialProgram);
  }

  async getReviewerByReviewerPk(reviewerPk: PublicKey) {
    return reviewerAccountByReviewerPK(
      this.tutorialProgram,
      this.pda.pdaReviewerAccount,
      reviewerPk,
    );
  }

  async getReviewerByReviewerAccountPDA(reviewerAccountPk: PublicKey) {
    return reviewerAccountByReviewerAccountPDA(
      this.tutorialProgram,
      reviewerAccountPk,
    );
  }

  async getReviewerByGithubLogin(githubLogin: string) {
    return reviewerAccountByGithubLogin(this.tutorialProgram, githubLogin);
  }

  async getDaoVaultAccountBalance(mintPk: anchor.web3.PublicKey) {
    return daoVaultAccountBalance(
      this.provider,
      mintPk,
      this.pda.pdaDaoVaultAccount,
    );
  }

  async getTutorialBySlug(slug: string) {
    return proposalAccountBySlug(this.tutorialProgram, slug);
  }

  async getTutorialById(id: number) {
    return proposalAccountById(
      this.tutorialProgram,
      this.pda.pdaProposalById,
      id,
    );
  }

  async getListOfVoters(tutorialId: number) {
    return listOfVoterById(this.tutorialProgram, tutorialId);
  }

  async getVote(tutorialId: number, publicKey: PublicKey) {
    return userVoteAccountById(
      this.tutorialProgram,
      this.pda.pdaUserVoteAccountById,
      publicKey,
      tutorialId,
    );
  }

  async getListOfTippers() {
    return tipperAccountList(this.tutorialProgram);
  }

  async getListOfTippersByUser(tipperPk: PublicKey) {
    return tipperAccountListByUser(this.tutorialProgram, tipperPk);
  }

  async getListOfTippersById(id: number) {
    return tipperAccountsListById(this.tutorialProgram, id);
  }

  async getTotalTipsById(id: number) {
    const tippers = await this.getListOfTippersById(id);
    const total = new anchor.BN(0);
    tippers.forEach(tipper => total.add(tipper.account.amount));
    return total;
  }

  // Instructions
  async castVote(proposalId: number) {
    return voteCast({
      program: this.tutorialProgram,
      proposalId,
      voterPk: this.provider.wallet.publicKey,
    });
  }

  async cancelVote(proposalId: number) {
    return voteCancel({
      program: this.tutorialProgram,
      proposalId,
      authorPk: this.provider.wallet.publicKey,
      voterPk: this.provider.wallet.publicKey,
    });
  }

  async createTutorial(data: {
    id: number;
    userPk: anchor.web3.PublicKey;
    slug: string;
    streamId: string;
  }): Promise<string> {
    return proposalCreate({
      program: this.tutorialProgram,
      mintPk: this.kafeMint,
      proposalId: data.id,
      userPk: data.userPk,
      slug: data.slug,
      streamId: data.streamId,
    });
  }

  async closeTutorial(data: {
    id: number;
    authorPk: anchor.web3.PublicKey;
    userPk: anchor.web3.PublicKey;
  }): Promise<string> {
    return proposalClose({
      program: this.tutorialProgram,
      mintPk: this.kafeMint,
      proposalId: data.id,
      authorPk: data.authorPk,
      userPk: data.userPk,
    });
  }

  async createReviewer(data: {
    authorityPk: anchor.web3.PublicKey;
    reviewerPk: anchor.web3.PublicKey;
    githubName: string;
  }): Promise<string> {
    return reviewerCreate({
      program: this.tutorialProgram,
      adminPk: data.authorityPk,
      reviewerPk: data.reviewerPk,
      githubName: data.githubName,
    });
  }

  async deleteReviewer(data: {
    authorityPk: anchor.web3.PublicKey;
    reviewerPk: anchor.web3.PublicKey;
    force?: boolean;
  }): Promise<string> {
    return reviewerDelete({
      program: this.tutorialProgram,
      reviewerPk: data.reviewerPk,
      adminPk: data.authorityPk,
      force: data.force,
    });
  }

  async assignReviewer(data: {
    authorityPk: anchor.web3.PublicKey;
    reviewerPks: anchor.web3.PublicKey[];
    id: number;
    force?: boolean;
  }): Promise<string> {
    return reviewerAssign({
      program: this.tutorialProgram,
      reviewer1Pk: data.reviewerPks[0],
      reviewer2Pk: data.reviewerPks[1],
      tutorialId: data.id,
      adminPk: data.authorityPk,
      force: data.force,
    });
  }

  async proposalSetState(data: {
    newState: ProposalStateE;
    adminPk: anchor.web3.PublicKey;
    id: number;
  }): Promise<string> {
    return proposalSetState({
      program: this.tutorialProgram,
      proposalId: data.id,
      adminPk: data.adminPk,
      newState: data.newState,
    });
  }

  async guideTipping(data: {
    id: number;
    tipperPk: anchor.web3.PublicKey;
    amount: anchor.BN;
  }): Promise<string> {
    return guideTipping({
      program: this.tutorialProgram,
      mintKafe: this.kafeMint,
      mintBDR: this.BdrMint,
      proposalId: data.id,
      tipperPk: data.tipperPk,
      amount: data.amount,
    });
  }

  async proposalPublish(data: {
    newState: ProposalStateE;
    authorPk: anchor.web3.PublicKey;
    adminPk: anchor.web3.PublicKey;
    id: number;
  }): Promise<string> {
    return proposalPublish({
      program: this.tutorialProgram,
      mintPk: this.kafeMint,
      proposalId: data.id,
      adminPk: data.adminPk,
      authorPk: data.authorPk,
    });
  }
}
