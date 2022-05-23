use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;
use crate::events::EventReviewerDelete;

#[derive(Accounts)]
pub struct ReviewerDelete<'info> {
  #[account(
    mut,
    constraint =  
      dao_account.admins.contains(&authority.key()) 
      || authority.key() == dao_account.super_admin
      @ ErrorDao::UnauthorizedAccess
    ,
    close = reviewer
  )]
  pub reviewer_account: Account<'info, ReviewerAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub reviewer: UncheckedAccount<'info>,  
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ReviewerDelete>, force: bool) -> Result<()> {
  if force { 
    return Ok(()); 
  }

  if ctx.accounts.reviewer_account.number_of_assignment != 0 {
    return Err(error!(ErrorDao::CannotDeleteAnAssignedReviewer));
  }

  emit!(EventReviewerDelete {
    reviewer: ctx.accounts.reviewer_account.key()
  });

  Ok(())
}
