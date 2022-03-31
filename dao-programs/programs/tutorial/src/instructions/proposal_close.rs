use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump:u8)]
pub struct ProposalCreatorClose<'info> {
  #[account(
    mut,
    constraint =  
    dao_account.admins.contains(&authority.key()) 
      || authority.key() == proposal_account.creator
      || authority.key() == dao_account.super_admin
      @ ErrorDao::UnauthorizedAccess 
    ,
    close = creator
  )]
  pub proposal_account: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub creator: UncheckedAccount<'info>,
  #[account(mut)]
  pub dao_vault: Account<'info, TokenAccount>,
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub authority: Signer<'info>,
  #[account(mut)]
  pub user_token_account: Account<'info, TokenAccount>,
  pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ProposalCreatorClose>, bump: u8) -> Result<()> {
  if ctx.accounts.proposal_account.number_of_voter != 0 {
    return Err(error!(ErrorDao::CannotCloseProposalRemainingVoter));
  };

  ctx.accounts.dao_account.number_of_proposal -= 1;
  let min_amount_to_create_proposal = ctx.accounts.dao_account.min_amount_to_create_proposal;

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault.to_account_info(),
    to: ctx.accounts.user_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint.key().as_ref(),
        &[bump],
      ]],
    ),
    min_amount_to_create_proposal,
  )?;

  Ok(())
}
