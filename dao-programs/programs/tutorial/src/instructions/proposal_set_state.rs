use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct ProposalSetState<'info> {
  #[account(
    mut,
    constraint = dao_account.admins.contains(&authority.key()) 
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub proposal_account: Account<'info, ProposalAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ProposalSetState>, state: String) -> Result<()> {
  let current_state = &mut ctx.accounts.proposal_account.state;
  *current_state = ProposalState::from_str(&state).unwrap();
  Ok(())
}
