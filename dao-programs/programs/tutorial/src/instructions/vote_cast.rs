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

use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8, id: u64)]
pub struct VoteCast<'info> {
  #[account(
    init,
    payer = author,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      id.to_le_bytes().as_ref(),
      author.key().as_ref(),
    ],
    bump,
    space = VoteAccount::LEN,
  )]
  pub vote_account: Account<'info, VoteAccount>,
  #[account(mut)]
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  pub proposal_account: Account<'info, ProposalAccount>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,
  pub token_program: Program<'info, Token>,
  #[account(mut)]
  pub bdr_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub dao_vault_bdr: Account<'info, TokenAccount>,
  pub mint_bdr: Account<'info, Mint>,
  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCast>, bump: u8, id: u64, bump_bdr: u8) -> Result<()> {
  let quorum = ctx.accounts.dao_account.quorum;

  ctx.accounts.vote_account.bump = bump;
  ctx.accounts.vote_account.id = id;
  ctx.accounts.vote_account.author = ctx.accounts.author.key();
  ctx.accounts.vote_account.voted_at = Clock::get()?.unix_timestamp;

  ctx.accounts.proposal_account.number_of_voter += 1;
  if ctx.accounts.proposal_account.number_of_voter == quorum {
    ctx.accounts.proposal_account.state = ProposalState::Funded;
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
      FUNDED_REWARD,
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
  }

  Ok(())
}