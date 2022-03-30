use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct DaoSetNonce<'info> {
  #[account(
    mut, 
    constraint = authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_account: Account<'info, DaoAccount>,
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<DaoSetNonce>, nonce: u64) -> Result<()> {
  ctx.accounts.dao_account.nonce = nonce;
  Ok(())
}