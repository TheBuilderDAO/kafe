use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct DaoSetAmountToCreateProposal<'info> {
  #[account(
    mut, 
    constraint = dao_account.admins.contains(&authority.key())
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_account: Account<'info, DaoAccount>,
  pub authority: Signer<'info>,
}

pub fn handler(
  ctx: Context<DaoSetAmountToCreateProposal>,
  min_amount_to_create_proposal: u64,
) -> Result<()> {
  ctx.accounts.dao_account.min_amount_to_create_proposal = min_amount_to_create_proposal;
  Ok(())
}
