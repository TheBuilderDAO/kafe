use anchor_lang::prelude::*;

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
  pub const LEN: usize = 8 + 1 + 8 + 32 + 32 + 8 + 8 + 4 + 8 * 32;
}
