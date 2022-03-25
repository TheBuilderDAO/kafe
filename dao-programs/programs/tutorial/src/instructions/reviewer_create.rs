use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(bump: u8, reviewer: Pubkey, github_name: String)]
pub struct ReviewerCreate<'info> {
  #[account(
    init,
    payer = authority,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      reviewer.as_ref(),
    ],
    bump,
    space = ReviewerAccount::space(&github_name),
    constraint = dao_config.admins.contains(&authority.key()) 
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub reviewer_account: Account<'info, ReviewerAccount>,
  pub dao_config : Account<'info, DaoAccount>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ReviewerCreate>, bump: u8, reviewer: Pubkey, github_name: String) -> Result<()> {
  if github_name.chars().count() > MAX_GITHUB_LOGIN_LEN {
    return Err(error!(ErrorDao::SlugTooLong));
  }

  ctx.accounts.reviewer_account.bump = bump;
  ctx.accounts.reviewer_account.pubkey = reviewer;
  ctx.accounts.reviewer_account.number_of_assignment = 0;
  ctx.accounts.reviewer_account.github_name = github_name;

  Ok(())
}