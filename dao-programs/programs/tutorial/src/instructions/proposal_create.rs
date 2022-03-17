use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount, Token, Transfer, Mint};

use crate::errors::*;
use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump:u8, id: u64, slug_pda: Pubkey)]
pub struct ProposalCreate<'info> {
  #[account(
    init,
    payer = payer,
    seeds = [ 
      PROGRAM_SEED.as_bytes(), 
      slug_pda.as_ref(),
    ],
    bump,
    space = ProposalAccount::LEN
  )]
  pub proposal: Account<'info, ProposalAccount>,
  #[account(mut)]
  pub dao_config: Account<'info, DaoAccount>,
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
  id: u64,
  _slug_pda: Pubkey,   
  slug: String,
  stream_id: String,
) -> Result<()> {
  let min_amount_to_create_proposal = ctx.accounts.dao_config.min_amount_to_create_proposal;
  token::transfer((&*ctx.accounts).into(), min_amount_to_create_proposal)?;

  if slug.chars().count() > 200 {
    return Err(error!(ErrorDao::SlugTooLong));
  }

  if stream_id.chars().count() > 200 {
    return Err(error!(ErrorDao::StreamIdTooLong));
  }

  ctx.accounts.proposal.created_at = Clock::get()?.unix_timestamp;
  ctx.accounts.proposal.creator = ctx.accounts.payer.key();
  ctx.accounts.proposal.stream_id = stream_id;
  ctx.accounts.proposal.bump = bump;
  ctx.accounts.proposal.slug = slug;
  ctx.accounts.proposal.id = id;
  ctx.accounts.proposal.number_of_voter = 0;
  ctx.accounts.proposal.state = 0;
  ctx.accounts.proposal.reviewer1 = Pubkey::default();
  ctx.accounts.proposal.reviewer2 = Pubkey::default();

  ctx.accounts.dao_config.number_of_tutorial += 1;
  Ok(())
}