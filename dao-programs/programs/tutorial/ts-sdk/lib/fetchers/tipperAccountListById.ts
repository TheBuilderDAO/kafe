import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterTipperById } from '../filters';
import _ from 'lodash';

/**
 * This function return all tippers for a given guide_id
 * Can be use to have the list of supporters for a guide
 */
const tipperAccountsListById = async (program: Program<Tutorial>, id: number) =>
  program.account.tipperAccount.all([filterTipperById(id)]);

export default tipperAccountsListById;
