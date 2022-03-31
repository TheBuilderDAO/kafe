use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;

#[derive(Accounts)]
pub struct DaoVaultInitialize<'info> {
  #[account(
    init,
    payer = payer,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      mint.key().as_ref(),
    ],
    bump,
    token::mint = mint,
    token::authority = dao_vault,
  )]
  pub dao_vault: Account<'info, TokenAccount>,
  pub mint: Account<'info, Mint>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub payer: Signer<'info>,
}

pub fn handler(_ctx: Context<DaoVaultInitialize>) -> Result<()> {
  Ok(())
}