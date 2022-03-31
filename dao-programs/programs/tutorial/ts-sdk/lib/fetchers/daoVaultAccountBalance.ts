import { Provider } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';

const daoVaultAccountBalance = async (
  provider: Provider,
  mintPk: anchor.web3.PublicKey,
  pdaDaoVaultAccount: any,
) => {
  const daoVault = await pdaDaoVaultAccount(mintPk);
  const rawBalance = await provider.connection.getTokenAccountBalance(
    daoVault.pda,
  );
  return {
    amount: rawBalance.value.uiAmount,
    decimals: rawBalance.value.decimals,
  };
};

export default daoVaultAccountBalance;
