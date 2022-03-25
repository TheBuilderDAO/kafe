pub const PROGRAM_SEED: &str = "BuilderDAO";
pub const TIPPING_SEED: &str = "Tipping";

pub const CREATOR_TIP_WEIGHT: u64 = 70;
pub const REVIEWER_TIP_WEIGHT: u64 = 15;

pub const CREATOR_REWARD: u64 = 1_000_000;
pub const CREATOR_TIP_REWARD: u64 = 1_000_000;
pub const REVIEWER_TIP_REWARD: u64 = 1_000_000;

pub const LEN_DISCRIMINATOR: usize = 8;
pub const LEN_U64: usize = 8;
pub const LEN_I64: usize = 8;
pub const LEN_U8: usize = 1;
pub const LEN_ENUM: usize = 1;
pub const LEN_PUBKEY: usize = 32;
pub const LEN_STRING_ALLOCATOR: usize = 4;
pub const LEN_VEC_ALLOCATOR: usize = 4;
pub const LEN_STREAM_ID: usize = 63;

pub const MAX_ADMIN_NUMBER: usize = 12;
pub const MAX_SLUG_LEN: usize = 100;
pub const MAX_GITHUB_LOGIN_LEN: usize = 50;
