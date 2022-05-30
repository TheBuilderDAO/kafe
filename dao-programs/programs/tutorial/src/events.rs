use anchor_lang::prelude::*;

use crate::state::ProposalState;

// Event emitted when instruction on DAO Account occurs
#[event]
pub struct EventDaoInitialize {
  pub nonce: u64,
  pub number_of_proposal: u64,
  pub quorum: u64,
  pub min_amount_to_create_proposal: u64,
  pub super_admin: Pubkey,
}

#[event]
pub struct EventDaoClose {
  pub dao_account: Pubkey,
}

#[event]
pub struct EventAddAdmin {
  pub admin: Pubkey,
}

#[event]
pub struct EventRemoveAdmin {
  pub admin: Pubkey,
}

#[event]
pub struct EventSetMinAmountToCreateProposal {
  pub min_amount_to_create_proposal: u64,
}

#[event]
pub struct EventSetNonce {
  pub nonce: u64,
}

#[event]
pub struct EventSetQuorum {
  pub quorum: u64,
}

// Events emitted when instruction on Vault Account occurs
#[event]
pub struct EventVaultInitialize {
  pub mint: Pubkey,
}

#[event]
pub struct EventVaultClose {
  pub mint: Pubkey,
}

// Events emitted when instruction on Proposal occurs
#[event]
pub struct EventProposalSetState {
  pub state: ProposalState,
  pub slug: String,
  pub id: u64,
}

#[event]
pub struct EventProposalClose {
  pub slug: String,
  pub id: u64,
}

#[event]
pub struct EventProposalCreate {
  pub creator: Pubkey,
  pub reviewer1: Pubkey,
  pub reviewer2: Pubkey,
  pub stream_id: String,
  pub slug: String,
  pub id: u64,
}

#[event]
pub struct EventProposalPublish {
  pub slug: String,
  pub id: u64,
}

#[event]
pub struct EventSetGuideCreator {
  pub creator: Pubkey,
  pub slug: String,
  pub id: u64,
}

// Events emitted when reviewer instruction occurs
#[event]
pub struct EventReviewerAssign {
  pub reviewer1: Pubkey,
  pub reviewer2: Pubkey,
  pub proposal_slug: String,
  pub proposal_id: u64,
}

#[event]
pub struct EventReviewerDelete {
  pub reviewer: Pubkey,
}

#[event]
pub struct EventReviewerCreate {
  pub reviewer: Pubkey,
}

// Events emitted when tippings instruction occurs
#[event]
pub struct EventTipperClose {
  pub tipper: Pubkey,
}

#[event]
pub struct EventGuideTipping {
  pub tipper: Pubkey,
  pub slug: String,
  pub amount: u64,
}

// Events emitted when vote instruction occurs
#[event]
pub struct EventVoteCancel {
  pub voter: Pubkey,
  pub proposal_slug: String,
  pub proposal_id: u64,
  pub proposal_voter_counter: u64,
}

#[event]
pub struct EventVoteCast {
  pub voter: Pubkey,
  pub proposal_slug: String,
  pub proposal_id: u64,
  pub proposal_voter_counter: u64,
}

// Events emitted when airdrop occurs
#[event]
pub struct EventAirdrop {
  pub receiver: Pubkey,
  pub mint: Pubkey,
  pub amount: u64,
}
