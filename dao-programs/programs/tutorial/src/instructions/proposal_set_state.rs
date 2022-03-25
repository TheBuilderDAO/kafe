use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct ProposalSetState<'info> {
  #[account(
    mut,
    constraint = dao_config.admins.contains(&signer.key()) 
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub proposal: Account<'info, ProposalAccount>,
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
}

pub fn handler(ctx: Context<ProposalSetState>, state: String) -> Result<()> {
  let current_state = &mut ctx.accounts.proposal.state;
  *current_state = ProposalState::from_str(&state).unwrap();
  Ok(())
}
