use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(Default)]
pub struct VoteAccount {
  pub bump: u8,
  pub id: u64,
  pub author: Pubkey,
  pub voted_at: i64,
}

impl VoteAccount {
  pub const LEN: usize = LEN_DISCRIMINATOR
    + LEN_U8
    + LEN_U64 
    + LEN_PUBKEY
    + LEN_I64;
}
