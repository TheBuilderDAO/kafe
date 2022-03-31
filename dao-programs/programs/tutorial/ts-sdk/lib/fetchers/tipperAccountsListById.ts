import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterTipperById } from '../filters';

/**
 * This function return all tippers for a given guide_id
 * Can be use to have the list of supporters for a guide
 */
const tipperAccountListById = async (program: Program<Tutorial>, id: number) =>
  program.account.tipperAccount.all([filterTipperById(id)]);

export default tipperAccountListById;
