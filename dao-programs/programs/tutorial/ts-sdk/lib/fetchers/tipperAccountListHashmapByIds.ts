import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterTipperById } from '../filters';
import _ from 'lodash';

export const tipperAccountListHashmapByIds = async (
  program: Program<Tutorial>,
  ids: number[],
) => {
  const filters = ids.map(filterTipperById);
  const tippers = await program.account.tipperAccount.all(filters);

  return _.groupBy(tippers, value => {
    return value.account.tutorialId.toString();
  });
};

export default tipperAccountListHashmapByIds;
