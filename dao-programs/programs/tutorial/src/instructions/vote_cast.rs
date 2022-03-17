use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct VoteCast<'info> {
  #[account(
    init,
    payer = author,
    seeds = [
      PROGRAM_SEED.as_bytes(), 
      tutorial.key().as_ref(),
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
  pub rent: Sysvar<'info, Rent>,
  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCast>, bump: u8) -> Result<()> {
  let quorum = ctx.accounts.dao_config.quorum;
  ctx.accounts.vote.bump = bump;
  ctx.accounts.vote.tutorial_pk = ctx.accounts.tutorial.key();
  ctx.accounts.vote.author = ctx.accounts.author.key();
  ctx.accounts.vote.voted_at = Clock::get()?.unix_timestamp;

  ctx.accounts.tutorial.number_of_voter += 1;
  if ctx.accounts.tutorial.number_of_voter == quorum {
    ctx.accounts.tutorial.state = state_from_str("funded").unwrap();
  }

  Ok(())
}