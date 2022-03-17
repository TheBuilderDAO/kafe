use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct VoteAccount {
  pub bump: u8,
  pub tutorial_pk: Pubkey,
  pub author: Pubkey,
  pub voted_at: i64,
}

impl VoteAccount {
  pub const LEN: usize = 8 + 1 + 32 + 32 + 8;
}
