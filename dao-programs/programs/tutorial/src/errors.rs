use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorDao {
  #[msg("Error: Insufficient funds in vault")]
  InsufficientFundsInVault,
  #[msg("Error: Given slug is too long")]
  SlugTooLong,
  #[msg("Error: Given streamId is too long")]
  StreamIdTooLong,
  #[msg("Error: User has already voted")]
  AlreadyVoter,
  #[msg("Error: You cannot cast a vote anymore")]
  CannotCastVoteAnymore,
  #[msg("Error: You cannot cancel a vote anymore")]
  CannotCancelVotelAnymore,
  #[msg("Error: You cannot delete an assigned reviewer")]
  CannotDeleteAnAssignedReviewer,
  #[msg("Error: You cannot assigned: same reviewer")]
  ReviewerNeedToBeDifferents,
  #[msg("Error: Remaining Voter Cannot Close proposal")]
  CannotCloseProposalRemainingVoter,
  #[msg("Error: Not authorize to call the instruction")]
  UnauthorizeAccess,
  #[msg("Error: Cannot setState: Invalid State")]
  InvalidState,
  #[msg("Error: Cannot setState: bad previous state")]
  BadPreviousState,
  #[msg("Error: Cannot tips: not enough SOL")]
  NotEnoughSolError,
  #[msg("Error: Assign Reviewer: Creator Cannot be reviewer")]
  CreatorCannotBeAReviewer
}
