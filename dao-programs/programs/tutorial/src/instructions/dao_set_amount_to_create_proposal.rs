use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct DaoSetAmountToCreateProposal<'info> {
  #[account(
    mut, 
    constraint = dao_config.admins.contains(&authority.key())
  )]
  pub dao_config: Account<'info, DaoAccount>,
  pub authority: Signer<'info>,
}

pub fn handler(
  ctx: Context<DaoSetAmountToCreateProposal>,
  min_amount_to_create_proposal: u64,
) -> Result<()> {
  ctx.accounts.dao_config.min_amount_to_create_proposal = min_amount_to_create_proposal;
  Ok(())
}
