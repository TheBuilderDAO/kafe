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
    className = 'dark:bg-kafedarker bg-kafelighter justify-center rounded-3xl text-kafeblack dark:text-kafelighter font-space font-extralight text-sm dark:hover:text-kafeblack dark:hover:bg-kafelighter hover:text-kafewhite hover:bg-kafeblack lg:w-[200px] text-center',
  } = props;
  const { wallet } = useDapp();

  return (
    <>
      <WalletMultiButton className={className}>
        {wallet.connected ? null : children}
      </WalletMultiButton>
    </>
  );
};

export default LoginButton;
