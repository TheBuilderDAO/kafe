use num_traits::ToPrimitive;
use anchor_lang::prelude::*;
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
  PROGRAM_SEED
};
use vipers::unwrap_int;

#[derive(Accounts)]
pub struct GuideTipping<'info> {
  #[account(
    init_if_needed,
    payer = signer,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      proposal.id.to_le_bytes().as_ref(),
      signer.key().as_ref(),
    ],
    bump,
    space = TipperAccount::LEN,
  )]
  pub tipper: Account<'info, TipperAccount>,
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
}

pub fn handler(ctx: Context<GuideTipping>, bump: u8, amount: u64) -> Result<()> {
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

  ctx.accounts.tipper.bump = bump;
  ctx.accounts.tipper.pubkey = ctx.accounts.signer.key();
  ctx.accounts.tipper.tutorial_id = ctx.accounts.proposal.id;
  ctx.accounts.tipper.amount += amount;

  Ok(())
}
