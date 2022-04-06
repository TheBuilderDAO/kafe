import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useDapp } from '../../hooks/useDapp';

type LoginButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const LoginButton = (props: LoginButtonProps) => {
  const {
    children = 'Connect wallet',
    className = 'dark:bg-kafedarker bg-kafelighter rounded-2xl text-kafeblack dark:text-kafelighter font-space font-extralight text-xs dark:hover:text-kafeblack dark:hover:bg-kafelighter hover:text-kafewhite hover:bg-kafeblack min-h-12 w-full text-center px-4 flex',
  } = props;
  const { wallet } = useDapp();

  return (
    <WalletMultiButton className={className}>
      <div className="grow">{wallet.connected ? null : children}</div>
    </WalletMultiButton>
  );
};

export default LoginButton;
