import { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterTipperByPk } from '../filters';

/**
 * This function return all tips done by a tipper
 * Can be use to collect the amount tips done by one user
 */
const tipperAccountListByUser = async (
  program: Program<Tutorial>,
  tipperPk: anchor.web3.PublicKey,
) => program.account.tipperAccount.all([filterTipperByPk(tipperPk)]);

export default tipperAccountListByUser;
