use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct ReviewerAssign<'info> {
  #[account(
    mut,
    constraint =  dao_config.admins.contains(&authority.key())
  )]
  pub reviewer1: Account<'info, ReviewerAccount>,
  #[account(
    mut,
    constraint = dao_config.admins.contains(&authority.key())
  )]
  pub reviewer2: Account<'info, ReviewerAccount>,
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub tutorial: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ReviewerAssign>) -> Result<()> {
  ctx.accounts.reviewer1.number_of_assignment += 1;
  ctx.accounts.reviewer2.number_of_assignment += 1;

  if ctx.accounts.reviewer1.key() == ctx.accounts.tutorial.creator 
    || ctx.accounts.reviewer2.key() == ctx.accounts.tutorial.creator {
    return Err(error!(ErrorDao::CreatorCannotBeAReviewer));
  }

  if ctx.accounts.reviewer1.key() == ctx.accounts.reviewer2.key() {
    return Err(error!(ErrorDao::ReviewerNeedToBeDifferents));
  }

  ctx.accounts.tutorial.reviewer1 = ctx.accounts.reviewer1.pubkey;
  ctx.accounts.tutorial.reviewer2 = ctx.accounts.reviewer2.pubkey;

  return Ok(());
}
