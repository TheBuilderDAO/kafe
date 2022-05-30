use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;
use crate::events::EventAddAdmin;

#[derive(Accounts)]
pub struct DaoAddAdmin<'info> {
  #[account(
    mut, 
    constraint = dao_account.admins.contains(&authority.key())
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_account: Account<'info, DaoAccount>,
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<DaoAddAdmin>, admin: Pubkey) -> Result<()> {
  if !ctx.accounts.dao_account.admins.contains(&admin) {
    ctx.accounts.dao_account.admins.push(admin);
  }

  emit!(EventAddAdmin {
    admin 
  });

  Ok(())
}