use anchor_lang::prelude::*;
use anchor_spl::token::{
  self, 
  Mint, 
  Token, 
  TokenAccount, 
  Transfer,   
  ThawAccount,
  FreezeAccount
};

use crate::state::*;
use crate::errors::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct ProposalPublish<'info> {
  #[account(
    mut,
    constraint = dao_account.admins.contains(&authority.key()) 
    || authority.key() == dao_account.super_admin
    || authority.key() == proposal_account.creator
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub proposal_account: Account<'info, ProposalAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub dao_vault_kafe: Account<'info, TokenAccount>,
  pub mint_kafe: Account<'info, Mint>,
  #[account(mut)]
  pub authority: Signer<'info>,
  #[account(mut)]
  pub user_token_account: Box<Account<'info, TokenAccount>>,
  pub token_program: Program<'info, Token>,
  #[account(mut)]
  pub dao_vault_bdr: Box<Account<'info, TokenAccount>>,
  pub mint_bdr: Box<Account<'info, Mint>>,
  #[account(mut)]
  pub bdr_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub reviewer1_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub reviewer2_token_account: Box<Account<'info, TokenAccount>>,
}

pub fn handler(ctx: Context<ProposalPublish>, bump: u8, bump_bdr: u8) -> Result<()> {
  let current_state = &mut ctx.accounts.proposal_account.state;

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

  if ctx.accounts.bdr_token_account.is_frozen() { 
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = ThawAccount {
      account: ctx.accounts.bdr_token_account.to_account_info(),
      mint: ctx.accounts.mint_bdr.to_account_info(),
      authority: ctx.accounts.dao_vault_bdr.to_account_info(),
    };

    token::thaw_account(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_bdr.key().as_ref(),
          &[bump_bdr],
        ]],
      ),
    )?;
  }

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault_bdr.to_account_info(),
    to: ctx.accounts.bdr_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
    CREATOR_REWARD_BDR,
  )?;

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = FreezeAccount {
    account: ctx.accounts.bdr_token_account.to_account_info(),
    mint: ctx.accounts.mint_bdr.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::freeze_account(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
  )?;

  if ctx.accounts.reviewer2_token_account.is_frozen() { 
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = ThawAccount {
      account: ctx.accounts.reviewer2_token_account.to_account_info(),
      mint: ctx.accounts.mint_bdr.to_account_info(),
      authority: ctx.accounts.dao_vault_bdr.to_account_info(),
    };

    token::thaw_account(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_bdr.key().as_ref(),
          &[bump_bdr],
        ]],
      ),
    )?;
  }

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault_bdr.to_account_info(),
    to: ctx.accounts.reviewer2_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
    REVIEWER_REWARD,
  )?;

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = FreezeAccount {
    account: ctx.accounts.reviewer2_token_account.to_account_info(),
    mint: ctx.accounts.mint_bdr.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::freeze_account(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
  )?;

  if ctx.accounts.reviewer1_token_account.is_frozen() { 
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = ThawAccount {
      account: ctx.accounts.reviewer1_token_account.to_account_info(),
      mint: ctx.accounts.mint_bdr.to_account_info(),
      authority: ctx.accounts.dao_vault_bdr.to_account_info(),
    };

    token::thaw_account(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_bdr.key().as_ref(),
          &[bump_bdr],
        ]],
      ),
    )?;
  }

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault_bdr.to_account_info(),
    to: ctx.accounts.reviewer1_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
    REVIEWER_REWARD,
  )?;

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = FreezeAccount {
    account: ctx.accounts.reviewer1_token_account.to_account_info(),
    mint: ctx.accounts.mint_bdr.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::freeze_account(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
  )?;

  Ok(())
}
