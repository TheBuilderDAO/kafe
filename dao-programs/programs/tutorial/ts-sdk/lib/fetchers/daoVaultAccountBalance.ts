import { Provider } from '@project-serum/anchor';

const daoVaultAccountBalance = async (
  provider: Provider,
  pdaDaoVaultAccount: any,
) => {
  const daoVault = await pdaDaoVaultAccount();
  const rawBalance = await provider.connection.getTokenAccountBalance(
    daoVault.pda,
  );
  return {
    amount: rawBalance.value.uiAmount,
    decimals: rawBalance.value.decimals,
  };
};

export default daoVaultAccountBalance;
