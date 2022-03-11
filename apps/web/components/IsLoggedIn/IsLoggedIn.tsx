import React, { ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type IsLoggedInProps = {
  children: ReactNode;
};

const IsLoggedIn = (props: IsLoggedInProps) => {
  const { children } = props;

  const wallet = useWallet();

  if (!wallet || !wallet.connected) {
    return null;
  }

  return <>{children}</>;
};

export default IsLoggedIn;
