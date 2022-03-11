use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::errors::*;

#[account]
pub struct ProposalAccount {
  pub id: u64,
  pub bump: u8,
  pub creator: Pubkey,
  pub reviewer1: Pubkey,
  pub reviewer2: Pubkey,
  pub number_of_voter: u64,
  pub created_at: i64,
  pub state: ProposalState,
  pub slug: String,
  pub stream_id: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
#[repr(u8)]
pub enum ProposalState {
  Submitted = 0,
  Funded = 1,
  Writing = 2,
  HasReviewers = 3,
  ReadyToPublish = 4,
  Published = 5,
}

impl Default for ProposalState {
  fn default() -> Self {
    ProposalState::Submitted
  }
}

impl FromStr for ProposalState {
  type Err = Error;

  fn from_str(input: &str) -> Result<ProposalState> {
    match input {
      "submitted" => Ok(ProposalState::Submitted),
      "funded" => Ok(ProposalState::Funded),
      "writing" => Ok(ProposalState::Writing),
      "hasReviewers" => Ok(ProposalState::HasReviewers),
      "readyToPublish" => Ok(ProposalState::ReadyToPublish),
      "published" => Ok(ProposalState::Published),
      _ => Err(error!(ErrorDao::InvalidState)),
    }
  }
}

impl Default for ProposalAccount {
  fn default() -> Self {
    let stream_id = String::with_capacity(100);
    let slug = String::with_capacity(100);
    Self {
      id: u64::default(),
      bump: u8::default(),
      creator: Pubkey::default(),
      reviewer1: Pubkey::default(),
      reviewer2: Pubkey::default(),
      number_of_voter: u64::default(),
      created_at: i64::default(),
      state: ProposalState::default(),
      slug,
      stream_id,
    }
  }
}

impl ProposalAccount {
  // 8 + 8 + 1 + 1 + 32 + 32 + 32 + 8 + 8 + 4 + 4 * 100 + 4 + 4 * 100
  pub const LEN: usize = 938;
}
