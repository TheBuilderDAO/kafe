use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ReviewerAccount {
  pub bump: u8,
  pub pubkey: Pubkey,
  pub number_of_assignment: u8,
  pub github_name: String,
}

impl ReviewerAccount {
  pub const LEN: usize = 8 + 1 + 32 + 1 + 4 + 4 * 50;
}
