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

use crate::errors::*;
use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8, bump_bdr: u8, slug: String)]
pub struct ProposalCreate<'info> {
  #[account(
    init,
    payer = payer,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      dao_account.nonce.to_le_bytes().as_ref(),
    ],
    bump,
    space=ProposalAccount::space(&slug),
  )]
  pub proposal_account: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub dao_vault: Account<'info, TokenAccount>,
  pub mint: Account<'info, Mint>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub payer: Signer<'info>,
  #[account(mut)]
  pub user_token_account: Box<Account<'info, TokenAccount>>,
  pub token_program: Program<'info, Token>,
  #[account(mut)]
  pub bdr_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub dao_vault_bdr: Box<Account<'info, TokenAccount>>,
  pub mint_bdr: Box<Account<'info, Mint>>,
}

impl<'info> From<&ProposalCreate<'info>> for CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
  fn from(accounts: &ProposalCreate<'info>) -> Self {
    let cpi_program = accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
        from: accounts.user_token_account.to_account_info(),
        to: accounts.dao_vault.to_account_info(),
        authority: accounts.payer.to_account_info(),
    };

    CpiContext::new(cpi_program, cpi_accounts)
  }
}

pub fn handler(
  ctx: Context<ProposalCreate>, 
  bump: u8,
  bump_bdr: u8,
  slug: String,
  stream_id: String,
) -> Result<()> {
  let min_amount_to_create_proposal = ctx.accounts.dao_account.min_amount_to_create_proposal;
  token::transfer((&*ctx.accounts).into(), min_amount_to_create_proposal)?;

  if slug.chars().count() > MAX_SLUG_LEN {
    return Err(error!(ErrorDao::SlugTooLong));
  }

  if stream_id.chars().count() != LEN_STREAM_ID {
    return Err(error!(ErrorDao::StreamIdSizeMissmatch));
  }
  let id = ctx.accounts.dao_account.nonce;
  let default_reviewer = ctx.accounts.dao_account.super_admin;
  ctx.accounts.proposal_account.created_at = Clock::get()?.unix_timestamp;
  ctx.accounts.proposal_account.creator = ctx.accounts.payer.key();
  ctx.accounts.proposal_account.state = ProposalState::default();
  ctx.accounts.proposal_account.stream_id = stream_id;
  ctx.accounts.proposal_account.bump = bump;
  ctx.accounts.proposal_account.slug = slug;
  ctx.accounts.proposal_account.id = id;
  ctx.accounts.proposal_account.number_of_voter = 0;
  ctx.accounts.proposal_account.tipped_amount = 0;
  ctx.accounts.proposal_account.tipper_count = 0;
  ctx.accounts.proposal_account.reviewer1 = default_reviewer;
  ctx.accounts.proposal_account.reviewer2 = default_reviewer;

  ctx.accounts.dao_account.number_of_proposal += 1;
  ctx.accounts.dao_account.nonce += 1;

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
    PROPOSAL_REWARD,
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