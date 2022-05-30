use anchor_lang::prelude::*;
use std::str::FromStr;

use crate::state::*;
use crate::errors::*;
use crate::events::EventProposalSetState;

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
  ctx.accounts.proposal_account.state = ProposalState::from_str(&state).unwrap();

  emit!(EventProposalSetState {
    state: ctx.accounts.proposal_account.state.clone(),
    slug: ctx.accounts.proposal_account.slug.clone(),
    id: ctx.accounts.proposal_account.id,
  });

  Ok(())
}
