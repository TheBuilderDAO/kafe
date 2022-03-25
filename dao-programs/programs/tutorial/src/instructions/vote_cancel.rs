use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct VoteCancel<'info> {
  #[account(
    mut,     
    has_one = author,  
    close = author
  )]
  pub vote: Account<'info, VoteAccount>,
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub tutorial: Account<'info, ProposalAccount>,
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCancel>) -> Result<()> {
  let quorum = ctx.accounts.dao_config.quorum;
  if ctx.accounts.tutorial.number_of_voter >= quorum {
    return Err(error!(ErrorDao::CannotCancelVoteAnymore));
  }
  ctx.accounts.tutorial.number_of_voter -= 1;

  Ok(())
}