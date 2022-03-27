use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Token, Transfer, Mint};

use crate::errors::*;
use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8, slug: String)]
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
  pub user_token_account: Account<'info, TokenAccount>,
  pub token_program: Program<'info, Token>,
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
  ctx.accounts.proposal_account.reviewer1 = Pubkey::default();
  ctx.accounts.proposal_account.reviewer2 = Pubkey::default();

  ctx.accounts.dao_account.number_of_proposal += 1;
  ctx.accounts.dao_account.nonce += 1;

  Ok(())
}