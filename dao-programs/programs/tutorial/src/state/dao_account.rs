use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct DaoAccount {
  pub bump: u8,
  pub nonce: u64,
  pub number_of_proposal: u64,
  pub quorum: u64,
  pub min_amount_to_create_proposal: u64,
  pub super_admin: Pubkey,
  pub admins: Vec<Pubkey>,
}

impl Default for DaoAccount {
  fn default() -> Self {
    let admins = Vec::<Pubkey>::with_capacity(MAX_ADMIN_NUMBER);
    Self {
      bump: u8::default(),
      nonce: u64::default(),
      number_of_proposal: u64::default(),
      quorum: u64::default(),
      min_amount_to_create_proposal: u64::default(),
      super_admin: Pubkey::default(),
      admins
    }
  }
}

impl DaoAccount {
  pub const LEN: usize = LEN_DISCRIMINATOR
    + LEN_U8
    + LEN_U64
    + LEN_U64
    + LEN_U64
    + LEN_U64
    + LEN_VEC_ALLOCATOR + MAX_ADMIN_NUMBER * LEN_PUBKEY;
}
