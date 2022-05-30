use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;
use crate::events::EventTipperClose;


#[derive(Accounts)]
pub struct TipperClose<'info> {
  #[account(
    mut,
    constraint =  
      dao_account.admins.contains(&authority.key()) 
      || authority.key() == dao_account.super_admin
      @ ErrorDao::UnauthorizedAccess
    ,
    close = tipper
  )]
  pub tipper_account: Account<'info, TipperAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub tipper: UncheckedAccount<'info>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<TipperClose>) -> Result<()> {
  
  emit!(EventTipperClose {
    tipper: ctx.accounts.tipper_account.key(),
  });

  Ok(())
}