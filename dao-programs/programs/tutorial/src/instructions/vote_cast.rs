use anchor_lang::prelude::*;

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
  #[account(mut)]
  pub author: Signer<'info>,
}

pub fn handler(ctx: Context<VoteCast>, bump: u8, id: u64) -> Result<()> {
  let quorum = ctx.accounts.dao_account.quorum;

  ctx.accounts.vote_account.bump = bump;
  ctx.accounts.vote_account.id = id;
  ctx.accounts.vote_account.author = ctx.accounts.author.key();
  ctx.accounts.vote_account.voted_at = Clock::get()?.unix_timestamp;

  ctx.accounts.proposal_account.number_of_voter += 1;

  Ok(())
}