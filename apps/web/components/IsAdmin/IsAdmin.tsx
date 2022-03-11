import React, { ReactNode } from 'react';
import { useIsAdmin } from '@builderdao-sdk/dao-program';
import { useWallet } from '@solana/wallet-adapter-react';

type IsAdminProps = {
  children: ReactNode;
};

const IsAdmin = (props: IsAdminProps) => {
  const { children } = props;
  const wallet = useWallet();
  const { isAdmin, loading, error } = useIsAdmin();

  if (!wallet || !wallet.connected) {
    return null;
  }

  if (loading || error) {
    return null;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return null;
};

export default IsAdmin;
