use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct TipperAccount {
  pub tutorial_id: u64,
  pub bump: u8,
  pub pubkey: Pubkey,
  pub amount: u64,
}

impl TipperAccount {
  pub const LEN: usize = 8 + 1 + 32 + 8 + 8;
}
