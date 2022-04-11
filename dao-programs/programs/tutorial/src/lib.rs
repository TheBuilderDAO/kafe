use anchor_lang::prelude::*;

mod constants;
mod errors;
pub mod state;

pub mod instructions;
use instructions::*;

declare_id!("prg5qq3Tpr3mN8UgtVeqXYkp7QeFpHTb68ovzw2VwFp");

#[program]
pub mod tutorial {
  use super::*;

  pub fn airdrop(
    ctx: Context<Airdrop>,
    bump_kafe: u8,
    bump_bdr: u8,
    is_kafe_drop: bool,
    is_bdr_drop: bool,
  ) -> Result<()> {
    instructions::airdrop::handler(ctx, bump_kafe, bump_bdr, is_kafe_drop, is_bdr_drop)
  }

  pub fn dao_add_admin(ctx: Context<DaoAddAdmin>, admin: Pubkey) -> Result<()> {
    instructions::dao_add_admin::handler(ctx, admin)
  }

  pub fn dao_remove_admin(ctx: Context<DaoRemoveAdmin>, admin: Pubkey) -> Result<()> {
    instructions::dao_remove_admin::handler(ctx, admin)
  }

  pub fn dao_close(ctx: Context<DaoClose>) -> Result<()> {
    instructions::dao_close::handler(ctx)
  }

  pub fn dao_initialize(
    ctx: Context<DaoInitialize>,
    bump: u8,
    quorum: u64,
    min_amount_to_create_proposal: u64,
    super_admin: Pubkey,
    authorities: Vec<Pubkey>,
  ) -> Result<()> {
    instructions::dao_initialize::handler(
      ctx,
      bump,
      quorum,
      min_amount_to_create_proposal,
      super_admin,
      authorities,
    )
  }

  pub fn dao_set_amount_to_create_proposal(
    ctx: Context<DaoSetAmountToCreateProposal>,
    quorum: u64,
  ) -> Result<()> {
    instructions::dao_set_amount_to_create_proposal::handler(ctx, quorum)
  }

  pub fn dao_set_nonce(ctx: Context<DaoSetNonce>, nonce: u64) -> Result<()> {
    instructions::dao_set_nonce::handler(ctx, nonce)
  }

  pub fn dao_set_quorum(ctx: Context<DaoSetQuorum>, quorum: u64) -> Result<()> {
    instructions::dao_set_quorum::handler(ctx, quorum)
  }

  pub fn dao_vault_close(
    ctx: Context<DaoVaultClose>,
    bump: u8,
    amount: u64,
    freeze: bool,
  ) -> Result<()> {
    instructions::dao_vault_close::handler(ctx, bump, amount, freeze)
  }

  pub fn dao_vault_initialize(ctx: Context<DaoVaultInitialize>) -> Result<()> {
    instructions::dao_vault_initialize::handler(ctx)
  }

  pub fn guide_tipping(
    ctx: Context<GuideTipping>,
    bump: u8,
    amount: u64,
    bump_vault: u8,
    bump_bdr: u8,
  ) -> Result<()> {
    instructions::guide_tipping::handler(ctx, bump, amount, bump_vault, bump_bdr)
  }

  pub fn proposal_close(ctx: Context<ProposalCreatorClose>, bump: u8) -> Result<()> {
    instructions::proposal_close::handler(ctx, bump)
  }

  pub fn proposal_create(
    ctx: Context<ProposalCreate>,
    bump: u8,
    bump_bdr: u8,
    slug: String,
    stream_id: String,
  ) -> Result<()> {
    instructions::proposal_create::handler(ctx, bump, bump_bdr, slug, stream_id)
  }

  pub fn proposal_publish(ctx: Context<ProposalPublish>, bump: u8, bump_bdr: u8) -> Result<()> {
    instructions::proposal_publish::handler(ctx, bump, bump_bdr)
  }

  pub fn proposal_set_state(ctx: Context<ProposalSetState>, state: String) -> Result<()> {
    instructions::proposal_set_state::handler(ctx, state)
  }

  pub fn proposal_set_creator(ctx: Context<ProposalSetCreator>, bump: u8, bump_bdr: u8) -> Result<()> {
    instructions::proposal_set_creator::handler(ctx, bump, bump_bdr)
  }

  pub fn reviewer_assign(ctx: Context<ReviewerAssign>, force: bool) -> Result<()> {
    instructions::reviewer_assign::handler(ctx, force)
  }

  pub fn reviewer_create(
    ctx: Context<ReviewerCreate>,
    bump: u8,
    reviewer: Pubkey,
    github_name: String,
  ) -> Result<()> {
    instructions::reviewer_create::handler(ctx, bump, reviewer, github_name)
  }

  pub fn reviewer_delete(ctx: Context<ReviewerDelete>, force: bool) -> Result<()> {
    instructions::reviewer_delete::handler(ctx, force)
  }

  pub fn tipper_close(ctx: Context<TipperClose>) -> Result<()> {
    instructions::tipper_close::handler(ctx)
  }

  pub fn vote_cancel(ctx: Context<VoteCancel>) -> Result<()> {
    instructions::vote_cancel::handler(ctx)
  }

  pub fn vote_cast(ctx: Context<VoteCast>, bump: u8, tutorial_id: u64, bump_bdr: u8) -> Result<()> {
    instructions::vote_cast::handler(ctx, bump, tutorial_id, bump_bdr)
  }
}
