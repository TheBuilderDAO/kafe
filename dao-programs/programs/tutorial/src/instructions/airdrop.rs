use anchor_lang::prelude::*;

use anchor_spl::token::{
  self, 
  Mint, 
  Token, 
  TokenAccount, 
  ThawAccount,
  FreezeAccount,
  Transfer, 
};

use crate::state::*;
use crate::errors::*;

use crate::constants::{
  PROGRAM_SEED,
  AIRDROP_AMOUNT_BDR,
  AIRDROP_AMOUNT_KAFE,
};

#[derive(Accounts)]
pub struct Airdrop<'info> {
  #[account(
    mut,
    constraint = dao_account.admins.contains(&authority.key()) 
    || authority.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub dao_vault_kafe: Account<'info, TokenAccount>,
  pub mint_kafe: Account<'info, Mint>,
  #[account(mut)]
  pub dao_vault_bdr: Account<'info, TokenAccount>,
  pub mint_bdr: Account<'info, Mint>,
  #[account(mut)]
  pub kafe_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub bdr_token_account: Box<Account<'info, TokenAccount>>,
  pub token_program: Program<'info, Token>,
  #[account(mut)]
  pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<Airdrop>, bump_kafe: u8, bump_bdr: u8) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
      from: ctx.accounts.dao_vault_kafe.to_account_info(),
      to: ctx.accounts.kafe_token_account.to_account_info(),
      authority: ctx.accounts.dao_vault_kafe.to_account_info(),
    };
  
    token::transfer(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_kafe.key().as_ref(),
          &[bump_kafe],
        ]],
      ),
      AIRDROP_AMOUNT_KAFE,
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
      AIRDROP_AMOUNT_BDR,
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

  Ok(())
}
