use anchor_lang::prelude::*;

use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct DaoInitialize<'info> {
  #[account(
    init,
    payer = payer,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
    ],
    bump,
    space = DaoAccount::LEN,
  )]
  pub dao_account: Account<'info, DaoAccount>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub payer: Signer<'info>,
}

pub fn handler(
  ctx: Context<DaoInitialize>, 
  bump: u8, 
  quorum: u64, 
  min_amount_to_create_proposal: u64, 
  super_admin: Pubkey, 
  authorities: Vec<Pubkey>
) -> Result<()> {
  ctx.accounts.dao_account.bump = bump;
  ctx.accounts.dao_account.quorum = quorum;
  ctx.accounts.dao_account.min_amount_to_create_proposal = min_amount_to_create_proposal;
  ctx.accounts.dao_account.super_admin = super_admin;
  ctx.accounts.dao_account.admins = authorities.clone();
 
  Ok(())
}