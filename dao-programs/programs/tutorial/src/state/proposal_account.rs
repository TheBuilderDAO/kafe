use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::errors::*;
use crate::constants::*;

#[account]
pub struct ProposalAccount {
  pub id: u64,
  pub bump: u8,
  pub creator: Pubkey,
  pub reviewer1: Pubkey,
  pub reviewer2: Pubkey,
  pub number_of_voter: u64,
  pub created_at: i64,
  pub tipped_amount: u64,
  pub tipper_count: u64,
  pub state: ProposalState,
  pub stream_id: String,
  pub slug: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
#[repr(u8)]
pub enum ProposalState {
  Submitted = 0,
  Funded = 1,
  Writing = 2,
  ReadyToPublish = 3,
  Published = 4,
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
      "readyToPublish" => Ok(ProposalState::ReadyToPublish),
      "published" => Ok(ProposalState::Published),
      _ => Err(error!(ErrorDao::InvalidState)),
    }
  }
}


impl Default for ProposalAccount {
  fn default() -> Self {
    let stream_id = String::with_capacity(LEN_STREAM_ID);
    Self {
      id: u64::default(),
      bump: u8::default(),
      creator: Pubkey::default(),
      reviewer1: Pubkey::default(),
      reviewer2: Pubkey::default(),
      number_of_voter: u64::default(),
      created_at: i64::default(),
      tipped_amount: u64::default(),
      tipper_count: u64::default(),
      state: ProposalState::default(),
      slug: String::default(),
      stream_id,
    }
  }
}

impl ProposalAccount {
  pub fn space(slug: &str) -> usize {
    LEN_DISCRIMINATOR 
    + LEN_U64 
    + LEN_U8 
    + LEN_PUBKEY 
    + LEN_PUBKEY 
    + LEN_PUBKEY 
    + LEN_U64 
    + LEN_I64 
    + LEN_U64 
    + LEN_U64 
    + LEN_ENUM 
    + LEN_STRING_ALLOCATOR + LEN_STREAM_ID
    + LEN_STRING_ALLOCATOR + slug.len()
  }
}
