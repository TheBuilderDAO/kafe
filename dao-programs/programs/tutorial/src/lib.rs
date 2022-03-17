use anchor_lang::prelude::*;

mod constants;
mod errors;
pub mod state;

pub mod instructions;
use instructions::*;

declare_id!("5uqVjzqsPdJyyV8wYbzw7D2DE3BNA5Y6pLuu1npiE9vu");

#[program]
pub mod tutorial {
  use super::*;

  pub fn dao_initialize(
    ctx: Context<DaoInitialize>,
    bump: u8,
    quorum: u64,
    authorities: Vec<Pubkey>,
  ) -> Result<()> {
    instructions::dao_initialize::handler(ctx, bump, quorum, authorities)
  }

  pub fn dao_set_quorum(ctx: Context<DaoSetQuorum>, quorum: u64) -> Result<()> {
    instructions::dao_set_quorum::handler(ctx, quorum)
  }

  pub fn dao_add_admin(ctx: Context<DaoAddAdmin>, admin: Pubkey) -> Result<()> {
    instructions::dao_add_admin::handler(ctx, admin)
  }

  pub fn dao_remove_admin(ctx: Context<DaoRemoveAdmin>, admin: Pubkey) -> Result<()> {
    instructions::dao_remove_admin::handler(ctx, admin)
  }

  pub fn dao_set_amount_to_create_proposal(
    ctx: Context<DaoSetAmountToCreateProposal>,
    quorum: u64,
  ) -> Result<()> {
    instructions::dao_set_amount_to_create_proposal::handler(ctx, quorum)
  }

  pub fn proposal_create(
    ctx: Context<ProposalCreate>,
    bump: u8,
    id: u64,
    slug_pda: Pubkey,   
    slug: String,
    stream_id: String,
  ) -> Result<()> {
    instructions::proposal_create::handler(ctx, bump, id, slug_pda, slug, stream_id)
  }

  pub fn proposal_set_state(ctx: Context<ProposalSetState>, state: String) -> Result<()> {
    instructions::proposal_set_state::handler(ctx, state)
  }

  pub fn guide_tipping(ctx: Context<GuideTipping>, amount: u64) -> Result<()> {
    instructions::guide_tipping::handler(ctx, amount)
  }

  pub fn proposal_close(ctx: Context<ProposalCreatorClose>, bump: u8) -> Result<()> {
    instructions::proposal_close::handler(ctx, bump)
  }

  pub fn vote_cast(ctx: Context<VoteCast>, bump: u8) -> Result<()> {
    instructions::vote_cast::handler(ctx, bump)
  }

  pub fn vote_cancel(ctx: Context<VoteCancel>) -> Result<()> {
    instructions::vote_cancel::handler(ctx)
  }

  pub fn reviewer_create(
    ctx: Context<ReviewerCreate>,
    bump: u8,
    reviewer: Pubkey,
    github_name: String,
  ) -> Result<()> {
    instructions::reviewer_create::handler(ctx, bump, reviewer, github_name)
  }

  pub fn reviewer_delete(ctx: Context<ReviewerDelete>) -> Result<()> {
    instructions::reviewer_delete::handler(ctx)
  }

  pub fn reviewer_assign(ctx: Context<ReviewerAssign>) -> Result<()> {
    instructions::reviewer_assign::handler(ctx)
  }
}

#[cfg(test)]
mod tests {
  #[test]
  fn hello_test() {
    println!("hello test");
  }
}
