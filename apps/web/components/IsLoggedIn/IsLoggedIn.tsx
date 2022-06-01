import React, { ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import LoginButton from '../LoginButton/LoginButton';

type IsLoggedInProps = {
  Placeholder?: React.ReactElement;
};

const IsLoggedIn: React.FC<IsLoggedInProps> = props => {
  const { children, Placeholder } = props;

  const wallet = useWallet();

  if (Placeholder && (!wallet || !wallet.connected)) {
    return Placeholder;
  }

  if (!wallet || !wallet.connected) {
    return null;
  }

  return <>{children}</>;
};

export default IsLoggedIn;
