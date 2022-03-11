use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct DaoSetQuorum<'info> {
  #[account(
    mut, 
    constraint = dao_config.admins.contains(&authority.key())
  )]
  pub dao_config: Account<'info, DaoAccount>,
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<DaoSetQuorum>, quorum: u64) -> Result<()> {
  ctx.accounts.dao_config.quorum = quorum;
  Ok(())
}