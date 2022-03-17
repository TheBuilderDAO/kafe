use anchor_lang::prelude::*;

use crate::errors::*;

#[account]
pub struct ProposalAccount {
  pub id: u64,
  pub state: u8,
  pub bump: u8,
  pub creator: Pubkey,
  pub reviewer1: Pubkey,
  pub reviewer2: Pubkey,
  pub number_of_voter: u64,
  pub created_at: i64,
  pub slug: String,
  pub stream_id: String,
}

pub fn state_from_str(input: &str) -> Result<u8> {
  match input {
    "submitted" => Ok(0),
    "funded" => Ok(1),
    "writing" => Ok(2),
    "hasReviewers" => Ok(3),
    "readyToPublish" => Ok(4),
    "published" => Ok(5),
    _ => Err(error!(ErrorDao::InvalidState)),
  }
}

impl Default for ProposalAccount {
  fn default() -> Self {
    let stream_id = String::with_capacity(100);
    let slug = String::with_capacity(100);
    Self {
      id: u64::default(),
      state: u8::default(),
      bump: u8::default(),
      creator: Pubkey::default(),
      reviewer1: Pubkey::default(),
      reviewer2: Pubkey::default(),
      number_of_voter: u64::default(),
      created_at: i64::default(),
      slug,
      stream_id,
    }
  }
}

impl ProposalAccount {
  // 8 + 8 + 1 + 1 + 32 + 32 + 32 + 8 + 8 + 4 + 4 * 100 + 4 + 4 * 100
  pub const LEN: usize = 1000;
}
