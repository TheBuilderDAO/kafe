use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct DaoRemoveAdmin<'info> {
  #[account(
    mut, 
    constraint = dao_config.admins.contains(&signer.key())
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_config: Account<'info, DaoAccount>,
  pub signer: Signer<'info>,
}

pub fn handler(ctx: Context<DaoRemoveAdmin>, admin: Pubkey) -> Result<()> {
  ctx.accounts.dao_config.admins.retain(|&pk| pk != admin );
  Ok(())
}