use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(Default)]
pub struct ReviewerAccount {
  pub bump: u8,
  pub pubkey: Pubkey,
  pub number_of_assignment: u8,
  pub github_name: String,
}

impl ReviewerAccount {
  pub const LEN: usize = LEN_DISCRIMINATOR
    + LEN_PUBKEY
    + LEN_U8
    + LEN_STRING_ALLOCATOR + LEN_GITHUB_NAME;
}
