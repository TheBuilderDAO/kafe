use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;
use crate::events::*;

#[derive(Accounts)]
pub struct ReviewerAssign<'info> {
  #[account(
    mut,
    constraint =  dao_account.admins.contains(&authority.key())
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub reviewer1: Account<'info, ReviewerAccount>,
  #[account(
    mut,
    constraint = dao_account.admins.contains(&authority.key())
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub reviewer2: Account<'info, ReviewerAccount>,
  pub prev_reviewer1: Account<'info, ReviewerAccount>,
  pub prev_reviewer2: Account<'info, ReviewerAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub proposal_account: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ReviewerAssign>, force: bool) -> Result<()> {
  if force {
    ctx.accounts.proposal_account.reviewer1 = ctx.accounts.reviewer1.pubkey;
    ctx.accounts.proposal_account.reviewer2 = ctx.accounts.reviewer2.pubkey;
  
    ctx.accounts.reviewer1.number_of_assignment += 1;
    ctx.accounts.reviewer2.number_of_assignment += 1;
    ctx.accounts.prev_reviewer1.number_of_assignment -= 1;
    ctx.accounts.prev_reviewer2.number_of_assignment -= 1;
  
    return Ok(()); 
  }

  if ctx.accounts.reviewer1.pubkey == ctx.accounts.proposal_account.creator 
    || ctx.accounts.reviewer2.pubkey == ctx.accounts.proposal_account.creator {
    return Err(error!(ErrorDao::CreatorCannotBeAReviewer));
  }

  if ctx.accounts.reviewer1.key() == ctx.accounts.reviewer2.key() {
    return Err(error!(ErrorDao::ReviewerNeedToBeDifferents));
  }

  ctx.accounts.proposal_account.reviewer1 = ctx.accounts.reviewer1.pubkey;
  ctx.accounts.proposal_account.reviewer2 = ctx.accounts.reviewer2.pubkey;

  ctx.accounts.reviewer1.number_of_assignment += 1;
  ctx.accounts.reviewer2.number_of_assignment += 1;
  ctx.accounts.prev_reviewer1.number_of_assignment -= 1;
  ctx.accounts.prev_reviewer2.number_of_assignment -= 1;

  emit!(EventReviewerAssign {
    reviewer1: ctx.accounts.proposal_account.reviewer1,
    reviewer2: ctx.accounts.proposal_account.reviewer1,
    proposal_slug: ctx.accounts.proposal_account.slug.clone(),
    proposal_id: ctx.accounts.proposal_account.id,
  });

  return Ok(());
}
