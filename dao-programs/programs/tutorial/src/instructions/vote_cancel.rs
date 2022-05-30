use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;
use crate::events::EventVoteCancel;

#[derive(Accounts)]
pub struct VoteCancel<'info> {
  #[account(
    mut,
    constraint =  
      dao_account.admins.contains(&authority.key()) 
      || authority.key() == vote_account.author
      || authority.key() == dao_account.super_admin
      @ ErrorDao::UnauthorizedAccess
    ,
    close = author
  )]
  pub vote_account: Account<'info, VoteAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub proposal_account: Account<'info, ProposalAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub author: UncheckedAccount<'info>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCancel>) -> Result<()> {
  let quorum = ctx.accounts.dao_account.quorum;
  if ctx.accounts.proposal_account.number_of_voter >= quorum {
    return Err(error!(ErrorDao::CannotCancelVoteAnymore));
  }
  ctx.accounts.proposal_account.number_of_voter -= 1;

  emit!(EventVoteCancel {
    voter: ctx.accounts.vote_account.key(),
    proposal_slug: ctx.accounts.proposal_account.slug.clone(),
    proposal_id: ctx.accounts.proposal_account.id,
    proposal_voter_counter: ctx.accounts.proposal_account.number_of_voter,
  });

  Ok(())
}