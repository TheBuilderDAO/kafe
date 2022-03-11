use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

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
  pub dao_config: Account<'info, DaoAccount>,
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

pub fn handler(ctx: Context<DaoInitialize>, bump: u8, quorum: u64, authorities: Vec<Pubkey>) -> Result<()> {
  ctx.accounts.dao_config.mint = ctx.accounts.mint.key();
  ctx.accounts.dao_config.bump = bump;
  ctx.accounts.dao_config.quorum = quorum;
  ctx.accounts.dao_config.min_amount_to_create_proposal = 1_000_000;
  ctx.accounts.dao_config.admins = authorities.clone();
 
  Ok(())
}