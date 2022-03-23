import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const LoginButton = props => {
  return (
    <>
      <WalletMultiButton
        className="
        dark:bg-kafedarker
        bg-kafelighter
        rounded-2xl
        text-kafeblack
        dark:text-kafelighter
        font-space
        font-extralight
        text-sm
        dark:hover:text-kafeblack
        dark:hover:bg-kafelighter
        hover:text-kafewhite
        hover:bg-kafeblack
        text-center
        "
      />
    </>
  );
};

export default LoginButton;
