import React, { useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useDapp } from '../../hooks/useDapp';
import { useViewerConnection } from '@self.id/react';
import { solana } from '@ceramicnetwork/blockchain-utils-linking';

type LoginButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const LoginButton = (props: LoginButtonProps) => {
  const {
    children = 'Connect wallet',
    className = 'dark:bg-kafedarker bg-kafelighter rounded-2xl text-kafeblack dark:text-kafelighter font-space font-extralight dark:hover:text-kafeblack dark:hover:bg-kafelighter hover:text-kafewhite hover:bg-kafeblack min-h-12 min-w-[188px] px-4 flex justify-center text-sm',
  } = props;
  const [connection, connect, disconnect] = useViewerConnection();
  const { wallet } = useDapp();

  useEffect(() => {
    if (wallet.connected) {
      const authProvider = new solana.SolanaAuthProvider(
        wallet,
        wallet.publicKey.toString(),
        solana.SOLANA_TESTNET_CHAIN_REF,
      );
      connect(authProvider as any);
    } else {
      disconnect();
    }
  }, [wallet.connected]);

  return (
    <WalletMultiButton
      className={className}
      disabled={connection.status === 'connecting'}
    >
      {connection.status === 'connected' ? null : children}
    </WalletMultiButton>
  );
};

export default LoginButton;
