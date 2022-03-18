import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

/**
 * This function return all tippers account
 * Can be use to collect the amount for all tips
 */
const tipperAccountList = async (program: Program<Tutorial>) => {
  return await program.account.tipperAccount.all();
};

export default tipperAccountList;
