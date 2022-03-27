use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct DaoRemoveAdmin<'info> {
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
  ctx: Context<DaoRemoveAdmin>, 
  admin: Pubkey
) -> Result<()> {
  ctx.accounts.dao_account.admins.retain(|&pk| pk != admin );
  Ok(())
}