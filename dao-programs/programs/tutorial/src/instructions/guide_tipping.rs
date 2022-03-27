use num_traits::ToPrimitive;
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
use anchor_lang::solana_program::{
  system_instruction, 
  system_program, 
  program::invoke
};

use crate::state::*;
use crate::errors::*;
use crate::constants::{
  REVIEWER_TIP_WEIGHT, 
  CREATOR_TIP_WEIGHT,
  PROGRAM_SEED,
  TIPPING_SEED,
  CREATOR_TIP_REWARD,
  REVIEWER_TIP_REWARD,
};
use vipers::unwrap_int;

#[derive(Accounts)]
pub struct GuideTipping<'info> {
  #[account(
    init_if_needed,
    payer = signer,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      TIPPING_SEED.as_bytes(), 
      proposal.id.to_le_bytes().as_ref(),
      signer.key().as_ref(),
    ],
    bump,
    space = TipperAccount::LEN,
  )]
  pub tipper_account: Account<'info, TipperAccount>,
  pub proposal: Account<'info, ProposalAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub creator: UncheckedAccount<'info>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub reviewer2: UncheckedAccount<'info>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub reviewer1: UncheckedAccount<'info>,
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(address = system_program::ID)]
  /// CHECK: we do not perform any mutation here
  pub system_program : AccountInfo<'info>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub dao_vault_kafe: Box<Account<'info, TokenAccount>>,
  pub mint_kafe: Box<Account<'info, Mint>>,
  #[account(mut)]
  pub dao_vault_bdr: Box<Account<'info, TokenAccount>>,
  pub mint_bdr: Box<Account<'info, Mint>>,
  #[account(mut)]
  pub creator_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub reviewer1_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub reviewer2_token_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub tipper_token_account: Box<Account<'info, TokenAccount>>,
  pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<GuideTipping>, bump: u8, amount: u64, bump_vault: u8, bump_bdr: u8) -> Result<()> {
  if ctx.accounts.proposal.state != ProposalState::Published {
    return Err(error!(ErrorDao::InvalidState))
  };

  if ctx.accounts.signer.to_account_info().lamports.borrow().checked_sub(amount) == None {
    return Err(error!(ErrorDao::NotEnoughSolError))
  }

  let creator_amount: u64 = unwrap_int!((amount)
    .checked_mul(CREATOR_TIP_WEIGHT)
    .and_then(|v| v.checked_div(100))
    .and_then(|v| v.to_u64()));

  let reviewer_amount: u64 = unwrap_int!((amount)
    .checked_mul(REVIEWER_TIP_WEIGHT)
    .and_then(|v| v.checked_div(100))
    .and_then(|v| v.to_u64()));

  let transfer_creator_ix = system_instruction::transfer(
    &ctx.accounts.signer.to_account_info().key(),
    &ctx.accounts.creator.to_account_info().key(),
    creator_amount,
  );
  invoke(
    &transfer_creator_ix,
    &[
      ctx.accounts.signer.to_account_info(),
      ctx.accounts.creator.to_account_info(),
      ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  let transfer_reviewer1_ix = system_instruction::transfer(
    &ctx.accounts.signer.to_account_info().key(),
    &ctx.accounts.reviewer1.to_account_info().key(),
    reviewer_amount,
  );
  invoke(
    &transfer_reviewer1_ix,
    &[
      ctx.accounts.signer.to_account_info(),
      ctx.accounts.reviewer1.to_account_info(),
      ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  let transfer_reviewer2_ix = system_instruction::transfer(
    &ctx.accounts.signer.to_account_info().key(),
    &ctx.accounts.reviewer2.to_account_info().key(),
    reviewer_amount,
  );
  invoke(
    &transfer_reviewer2_ix,
    &[
      ctx.accounts.signer.to_account_info(),
      ctx.accounts.reviewer2.to_account_info(),
      ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  ctx.accounts.tipper_account.bump = bump;
  ctx.accounts.tipper_account.pubkey = ctx.accounts.signer.key();
  ctx.accounts.tipper_account.tutorial_id = ctx.accounts.proposal.id;
  ctx.accounts.tipper_account.amount += amount;
  
  ctx.accounts.proposal.tipped_amount += amount;
  ctx.accounts.proposal.tipper_count += 1;

  if ctx.accounts.proposal.tipper_count.rem_euclid(10) == 0 {
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts1 = Transfer {
      from: ctx.accounts.dao_vault_kafe.to_account_info(),
      to: ctx.accounts.creator_token_account.to_account_info(),
      authority: ctx.accounts.dao_vault_kafe.to_account_info(),
    };
  
    token::transfer(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts1,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_kafe.key().as_ref(),
          &[bump_vault],
        ]],
      ),
      CREATOR_TIP_REWARD,
    )?;

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts2 = Transfer {
      from: ctx.accounts.dao_vault_kafe.to_account_info(),
      to: ctx.accounts.reviewer1_token_account.to_account_info(),
      authority: ctx.accounts.dao_vault_kafe.to_account_info(),
    }; 
    token::transfer(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts2,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_kafe.key().as_ref(),
          &[bump_vault],
        ]],
      ),
      REVIEWER_TIP_REWARD,
    )?;

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts3 = Transfer {
      from: ctx.accounts.dao_vault_kafe.to_account_info(),
      to: ctx.accounts.reviewer2_token_account.to_account_info(),
      authority: ctx.accounts.dao_vault_kafe.to_account_info(),
    };
  
    token::transfer(
      CpiContext::new_with_signer(
        cpi_program,
        cpi_accounts3,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_kafe.key().as_ref(),
          &[bump_vault],
        ]],
      ),
      REVIEWER_TIP_REWARD,
    )?;
  }

  let adjusted_sol_amount: u64 = unwrap_int!((amount)
    .checked_div(100)
    .and_then(|v| v.to_u64()));

  let bdr_amount: u64 = unwrap_int!((adjusted_sol_amount)
    .checked_add(50000000)
    .and_then(|v| v.to_u64()));

  if ctx.accounts.tipper_token_account.is_frozen() { 
    let cpi_program5 = ctx.accounts.token_program.to_account_info();
    let cpi_accounts5 = ThawAccount {
      account: ctx.accounts.tipper_token_account.to_account_info(),
      mint: ctx.accounts.mint_bdr.to_account_info(),
      authority: ctx.accounts.dao_vault_bdr.to_account_info(),
    };

    token::thaw_account(
      CpiContext::new_with_signer(
        cpi_program5,
        cpi_accounts5,
        &[&[
          PROGRAM_SEED.as_bytes(),
          ctx.accounts.mint_bdr.key().as_ref(),
          &[bump_bdr],
        ]],
      ),
    )?;
  }

  let cpi_program = ctx.accounts.token_program.to_account_info();
  let cpi_accounts4 = Transfer {
    from: ctx.accounts.dao_vault_bdr.to_account_info(),
    to: ctx.accounts.tipper_token_account.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::transfer(
    CpiContext::new_with_signer(
      cpi_program,
      cpi_accounts4,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
    bdr_amount,
  )?;

  let cpi_program6 = ctx.accounts.token_program.to_account_info();
  let cpi_accounts6 = FreezeAccount {
    account: ctx.accounts.tipper_token_account.to_account_info(),
    mint: ctx.accounts.mint_bdr.to_account_info(),
    authority: ctx.accounts.dao_vault_bdr.to_account_info(),
  };

  token::freeze_account(
    CpiContext::new_with_signer(
      cpi_program6,
      cpi_accounts6,
      &[&[
        PROGRAM_SEED.as_bytes(),
        ctx.accounts.mint_bdr.key().as_ref(),
        &[bump_bdr],
      ]],
    ),
  )?;

  Ok(())
}
