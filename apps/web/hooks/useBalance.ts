import { NEXT_PUBLIC_BDR_MINT } from './../constants';
import {
  NEXT_PUBLIC_KAFE_MINT,
  NEXT_PUBLIC_SOLANA_NETWORK,
} from '@app/constants';
import { TutorialProgramConfig } from '@builderdao/program-tutorial';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import { useDapp } from './useDapp';
import axios from 'axios';

export const SOL_DECIMAL = 10 ** 9;
export const KAFE_DECIMAL = 10 ** 6;
export const BDR_DECIMAL = 10 ** 6;

interface WalletBalance {
  sol_balance: number;
  kafe_balance: number;
  bdr_balance: number;
}

export const useBalance = () => {
  const { wallet } = useDapp();
  const [balance, setBalance] = useState<WalletBalance>({
    sol_balance: 0,
    kafe_balance: 0,
    bdr_balance: 0, // ORCA token is only used on devnet.
  });
  const { data, error } = useSWR(
    `/balance/${wallet.publicKey?.toString()}`, // Cache key based on the keypair.
    async () => fetcher(wallet.publicKey?.toBase58()),
  );
  useEffect(() => {
    if (data) {
      /**
       * Documentation for  _.get https://lodash.com/docs/4.17.15#get
       */
      const sol_balance = _.get(data, '[0].result.value', 0);
      const kafe_balance = _.get(
        data,
        '[1].result.value[0]account.data.parsed.info.tokenAmount.amount',
        0,
      );
      const bdr_balance = _.get(
        data,
        '[2].result.value[0]account.data.parsed.info.tokenAmount.amount',
        0,
      );
      setBalance({ sol_balance, kafe_balance, bdr_balance });
    }
  }, [data, error, wallet.connected, wallet.disconnect]);
  return {
    balance,
    loading: !data && !error,
    error: error && error.message,
  };
};
const fetcher: Fetcher<string, any> = async (publicKeyBase58: string) => {
  const network = NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.Network;
  // @ts-ignore
  const result = await axios.post(
    TutorialProgramConfig.getClusterUrl(network),
    [
      {
        jsonrpc: '2.0',
        id: 0,
        method: 'getBalance', // SOL balance.
        params: [publicKeyBase58],
      },
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner', // https://docs.solana.com/developing/clients/jsonrpc-api#gettokenaccountsbyowner
        params: [
          publicKeyBase58,
          {
            mint: NEXT_PUBLIC_KAFE_MINT,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'getTokenAccountsByOwner', // https://docs.solana.com/developing/clients/jsonrpc-api#gettokenaccountsbyowner
        params: [
          publicKeyBase58,
          {
            mint: NEXT_PUBLIC_BDR_MINT,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      },
    ],
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return result.data;
};
