import { Program } from '@project-serum/anchor';
import { GetProgramAccountsFilter } from '@solana/web3.js';

import { Tutorial } from '../idl/tutorial';

const proposalAccountList = async (
  program: Program<Tutorial>,
  filter: Buffer | GetProgramAccountsFilter[] | undefined = undefined,
) => program.account.proposalAccount.all(filter);

export default proposalAccountList;
