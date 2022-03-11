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
      dao_config.admins.contains(&creator.key()) 
      || creator.key() == proposal.creator,
    close = creator
  )]
  pub proposal: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub dao_vault: Account<'info, TokenAccount>,
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub creator: Signer<'info>,
  #[account(mut)]
  pub user_token_account: Account<'info, TokenAccount>,
  pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ProposalCreatorClose>, bump: u8) -> Result<()> {
  if ctx.accounts.proposal.number_of_voter != 0 {
    return Err(error!(ErrorDao::CannotCloseProposalRemainingVoter));
  };

  ctx.accounts.dao_config.number_of_tutorial -= 1;
  let min_amount_to_create_proposal = ctx.accounts.dao_config.min_amount_to_create_proposal;

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
