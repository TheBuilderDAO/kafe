use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
  system_instruction, 
  system_program, 
  program::invoke
};
use anchor_spl::token::{
  self, 
  Mint, 
  Token, 
  TokenAccount, 
  Transfer, 
};
use num_traits::ToPrimitive;

use crate::state::*;
use crate::errors::*;

use crate::constants::{
  PROGRAM_SEED,
  CREATOR_TIP_REWARD,
  CREATOR_TIP_WEIGHT,
};
use vipers::unwrap_int;

#[derive(Accounts)]
pub struct ProposalSetCreator<'info> {
  #[account(
    mut,
    constraint = super_admin.key() == dao_account.super_admin
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub proposal_account: Account<'info, ProposalAccount>,
  pub dao_account: Account<'info, DaoAccount>,
  #[account(mut)]
  /// CHECK: we only add LAMPORT here
  pub creator: UncheckedAccount<'info>,
  #[account(address = system_program::ID)]
  /// CHECK: we do not perform any mutation here
  pub system_program : AccountInfo<'info>,
  #[account(mut)]
  pub dao_vault_kafe: Box<Account<'info, TokenAccount>>,
  pub mint_kafe: Box<Account<'info, Mint>>,
  #[account(mut)]
  pub creator_token_account: Box<Account<'info, TokenAccount>>,
  pub token_program: Program<'info, Token>,
  #[account(mut)]
  pub super_admin: Signer<'info>,
}

pub fn handler(ctx: Context<ProposalSetCreator>, bump: u8) -> Result<()> {
  if ctx.accounts.proposal_account.state != ProposalState::Published {
    return Err(error!(ErrorDao::InvalidState))
  };

  if ctx.accounts.proposal_account.creator != ctx.accounts.super_admin.key() {
    return Err(error!(ErrorDao::ActionOnlyPossibleForDefaultReviewer));
  }

  let amount = ctx.accounts.proposal_account.tipped_amount;
  let creator_amount: u64 = unwrap_int!((amount)
    .checked_mul(CREATOR_TIP_WEIGHT)
    .and_then(|v| v.checked_div(100))
    .and_then(|v| v.to_u64()));

  let transfer_ix = system_instruction::transfer(
    &ctx.accounts.super_admin.to_account_info().key(),
    &ctx.accounts.creator.to_account_info().key(),
    creator_amount,
  );
  invoke(
    &transfer_ix,
    &[
      ctx.accounts.super_admin.to_account_info(),
      ctx.accounts.creator.to_account_info(),
      ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  if ctx.accounts.proposal_account.tipper_count >= 10 {
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = Transfer {
      from: ctx.accounts.dao_vault_kafe.to_account_info(),
      to: ctx.accounts.creator_token_account.to_account_info(),
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
      CREATOR_TIP_REWARD,
    )?;
  }

  ctx.accounts.proposal_account.creator = ctx.accounts.creator.key();
  Ok(())
}
