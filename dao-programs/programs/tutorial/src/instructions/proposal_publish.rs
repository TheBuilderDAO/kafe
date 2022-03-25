use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct ProposalPublish<'info> {
  #[account(
    mut,
    constraint = dao_config.admins.contains(&signer.key()) 
    || signer.key() == proposal.creator
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub proposal: Account<'info, ProposalAccount>,
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub dao_vault_kafe: Account<'info, TokenAccount>,
  pub mint_kafe: Account<'info, Mint>,
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(mut)]
  pub user_token_account: Account<'info, TokenAccount>,
  pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ProposalPublish>, bump: u8) -> Result<()> {
  let current_state = &mut ctx.accounts.proposal.state;

  if *current_state != ProposalState::ReadyToPublish {
    return Err(error!(ErrorDao::InvalidState));
  }

  *current_state = ProposalState::Published;

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault_kafe.to_account_info(),
    to: ctx.accounts.user_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault_kafe.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_kafe.key().as_ref(),
        &[bump],
      ]],
    ),
    CREATOR_REWARD,
  )?;
  Ok(())
}
