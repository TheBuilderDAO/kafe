use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct DaoAccount {
  pub bump: u8,
  pub nonce: u64,
  pub number_of_tutorial: u64,
  pub mint: Pubkey,
  pub quorum: u64,
  pub min_amount_to_create_proposal: u64,
  pub admins: Vec<Pubkey>,
}

impl DaoAccount {
  pub const LEN: usize = LEN_DISCRIMINATOR
    + LEN_U8
    + LEN_U64
    + LEN_PUBKEY
    + LEN_PUBKEY
    + LEN_U64
    + LEN_U64
    + LEN_VEC_ALLOCATOR + MAX_ADMIN_NUMBER * LEN_PUBKEY;
}
