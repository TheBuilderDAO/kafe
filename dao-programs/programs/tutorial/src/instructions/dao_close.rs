use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

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

pub fn handler(_ctx: Context<DaoClose>) -> Result<()> {
   Ok(())
}