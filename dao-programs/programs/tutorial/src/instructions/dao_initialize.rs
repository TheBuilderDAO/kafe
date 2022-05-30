use anchor_lang::prelude::*;

use crate::state::*;
use crate::constants::*;
use crate::events::EventDaoInitialize;

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
  let dao_account = &mut ctx.accounts.dao_account;

  dao_account.bump = bump;
  dao_account.quorum = quorum;
  dao_account.min_amount_to_create_proposal = min_amount_to_create_proposal;
  dao_account.super_admin = super_admin;
  dao_account.admins = authorities.clone();

  emit!(EventDaoInitialize {
    nonce: dao_account.nonce,
    number_of_proposal: dao_account.number_of_proposal,
    quorum: dao_account.quorum,
    min_amount_to_create_proposal: dao_account.min_amount_to_create_proposal,
    super_admin: dao_account.super_admin,
});

  Ok(())
}