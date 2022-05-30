use anchor_lang::prelude::*;

use crate::errors::*;
use crate::events::EventDaoClose;
use crate::state::*;

#[derive(Accounts)]
pub struct DaoClose<'info> {
  #[account(
    mut,
    constraint = super_admin.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess,
    close = super_admin
  )]
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub super_admin: Signer<'info>,
}

pub fn handler(ctx: Context<DaoClose>) -> Result<()> {
  emit!(EventDaoClose {
    dao_account: ctx.accounts.dao_account.key(),
  });

  Ok(())
}
