use anchor_lang::prelude::*;
use anchor_spl::token::{
  self, CloseAccount, Mint, SetAuthority, ThawAccount, Token, TokenAccount, Transfer,
};

use crate::constants::*;
use crate::errors::*;
use crate::events::EventVaultClose;
use crate::state::*;

#[derive(Accounts)]
pub struct DaoVaultClose<'info> {
  #[account(mut,
    constraint = super_admin.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess,
  )]
  pub dao_vault: Account<'info, TokenAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub super_admin: Signer<'info>,
  #[account(mut)]
  pub super_admin_token_account: Account<'info, TokenAccount>,
  pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DaoVaultClose>, bump: u8, amount: u64, freeze: bool) -> Result<()> {
  if ctx.accounts.super_admin_token_account.is_frozen() {
    let cpi_program5 = ctx.accounts.token_program.to_account_info();
    let cpi_accounts5 = ThawAccount {
      account: ctx.accounts.super_admin_token_account.to_account_info(),
      mint: ctx.accounts.mint.to_account_info(),
      authority: ctx.accounts.dao_vault.to_account_info(),
    };

    token::thaw_account(CpiContext::new_with_signer(
      cpi_program5,
      cpi_accounts5,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint.key().as_ref(),
        &[bump],
      ]],
    ))?;
  }
  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = Transfer {
    from: ctx.accounts.dao_vault.to_account_info(),
    to: ctx.accounts.super_admin_token_account.to_account_info(),
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
    amount,
  )?;

  if freeze {
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = SetAuthority {
      current_authority: ctx.accounts.dao_vault.to_account_info(),
      account_or_mint: ctx.accounts.mint.to_account_info(),
    };

    token::set_authority(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint.key().as_ref(),
          &[bump],
        ]],
      ),
      spl_token::instruction::AuthorityType::FreezeAccount,
      Some(ctx.accounts.super_admin.key()),
    )?;
  }

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts = CloseAccount {
    account: ctx.accounts.dao_vault.to_account_info(),
    destination: ctx.accounts.super_admin.to_account_info(),
    authority: ctx.accounts.dao_vault.to_account_info(),
  };
  token::close_account(CpiContext::new_with_signer(
    cpi_program,
    cpi_accounts,
    &[&[
      PROGRAM_SEED.as_bytes(),
      ctx.accounts.mint.key().as_ref(),
      &[bump],
    ]],
  ))?;

  emit!(EventVaultClose {
    mint: ctx.accounts.mint.key(),
  });

  Ok(())
}

// Authority type
// https://docs.rs/spl-token/latest/spl_token/instruction/enum.AuthorityType.html
