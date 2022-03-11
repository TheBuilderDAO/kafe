use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct ReviewerDelete<'info> {
  #[account(mut, close = authority)]
  pub reviewer_account: Account<'info, ReviewerAccount>,
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ReviewerDelete>) -> Result<()> {
  // To exchange on this later
  if ctx.accounts.reviewer_account.number_of_assignment != 0 {
    return Err(error!(ErrorDao::CannotDeleteAnAssignedReviewer));
  }
  if !ctx
    .accounts
    .dao_config
    .admins
    .contains(&ctx.accounts.authority.key())
  {
    return Err(error!(ErrorDao::UnauthorizeAccess));
  }
  Ok(())
}
