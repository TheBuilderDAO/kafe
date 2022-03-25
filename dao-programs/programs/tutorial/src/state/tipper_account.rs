use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
#[derive(Default)]
pub struct TipperAccount {
  pub tutorial_id: u64,
  pub bump: u8,
  pub pubkey: Pubkey,
  pub amount: u64,
}

impl TipperAccount {
  pub const LEN: usize = LEN_DISCRIMINATOR
    + LEN_U64
    + LEN_U8
    + LEN_PUBKEY
    + LEN_U64;
}
