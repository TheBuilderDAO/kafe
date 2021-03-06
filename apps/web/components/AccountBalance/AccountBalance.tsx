import React, { useEffect, useState } from 'react';
import { useDapp } from '../../hooks/useDapp';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import solanaIcon from 'public/assets/icons/solana.svg';
import Image from 'next/image';

const AccountBalance = () => {
  const { wallet, connection } = useDapp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    const getBalance = async () => {
      try {
        setError(null);
        setLoading(true);

        const rawBalance = await connection.getBalance(wallet.publicKey);

        setBalance(rawBalance / LAMPORTS_PER_SOL);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getBalance();
  }, [connection, wallet.publicKey]);

  if (loading) {
    return <span>...</span>;
  }

  return (
    <span className="font-mono flex">
      <p className="mr-2 text-lg">{balance?.toFixed(2) || 0}</p>
      <Image src={solanaIcon} width={20} height={20} alt="sol icon" />
    </span>
  );
};

export default AccountBalance;
