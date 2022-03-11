import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const daoAccount = async (program: Program<Tutorial>, pdaDaoAccount: any) => {
  const daoAccount = await pdaDaoAccount();
  return program.account.daoAccount.fetch(daoAccount.pda);
};

export default daoAccount;
