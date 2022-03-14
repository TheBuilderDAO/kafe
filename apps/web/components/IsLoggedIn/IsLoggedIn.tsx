import React, { ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import LoginButton from '../LoginButton/LoginButton';

type IsLoggedInProps = {
  children: ReactNode;
  Placeholder?: React.ComponentType;
};

const IsLoggedIn = (props: IsLoggedInProps) => {
  const { children, Placeholder } = props;

  const wallet = useWallet();

  if (Placeholder && (!wallet || !wallet.connected)) {
    return <Placeholder />;
  }

  if (!wallet || !wallet.connected) {
    return null;
  }

  return <>{children}</>;
};

export default IsLoggedIn;
