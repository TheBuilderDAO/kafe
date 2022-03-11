import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const isAdmin = async (
  program: Program<Tutorial>,
  pdaDaoAccount: any,
  walletPk: anchor.web3.PublicKey,
) => {
  const daoAccount = await pdaDaoAccount();
  const data = await program.account.daoAccount.fetch(daoAccount.pda);
  return data.admins.some(pk => pk.toString() === walletPk.toString());
};

export default isAdmin;
