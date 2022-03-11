use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};

use crate::errors::*;
use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8, tutorial_id: u64)]
pub struct VoteCast<'info> {
  #[account(
    init,
    payer = author,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      tutorial_id.to_le_bytes().as_ref(),
      author.key().as_ref(),
    ],
    bump,
    space = VoteAccount::LEN,
  )]
  pub vote: Account<'info, VoteAccount>,
  #[account(mut)]
  pub dao_config: Account<'info, DaoAccount>,
  #[account(mut)]
  pub tutorial: Account<'info, ProposalAccount>,
  pub system_program: Program<'info, System>,
  pub mint: Account<'info, Mint>,
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCast>, bump: u8, tutorial_id: u64) -> Result<()> {
  if ctx.accounts.vote.voted_at != 0 {
    return Err(error!(ErrorDao::AlreadyVoter));
  }

  let quorum = ctx.accounts.dao_config.quorum;

  if ctx.accounts.tutorial.number_of_voter >= quorum {
    return Err(error!(ErrorDao::CannotCastVoteAnymore));
  }

  ctx.accounts.vote.bump = bump;
  ctx.accounts.vote.tutorial_id = tutorial_id;
  ctx.accounts.vote.author = ctx.accounts.author.key();
  ctx.accounts.vote.voted_at = Clock::get()?.unix_timestamp;

  ctx.accounts.tutorial.number_of_voter += 1;
  if ctx.accounts.tutorial.number_of_voter == quorum {
    ctx.accounts.tutorial.state = ProposalState::Funded;
  }

  Ok(())
}