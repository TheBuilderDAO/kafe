import { useCallback, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { mutate } from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGuideTipping = <AD>(): [
  (data: AD) => Promise<string | undefined>,
  {
    submitting: boolean;
    error: Error | null;
  },
] => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const tutorialProgram = useTutorialProgram();

  const handleAction = useCallback(
    // TODO: Add types.
    async (data: any) => {
      try {
        setError(null);
        setSubmitting(true);

        const amount = new anchor.BN(data.amount);

        const txHash = await tutorialProgram?.guideTipping({
          id: data.id,
          tipperPk: data.tipperPk,
          amount,
        });

        console.log('TX Hash', txHash);

        const newTip = {
          tutorialId: data.id,
          pubkey: tutorialProgram.provider.wallet.publicKey,
          amount,
        };

        mutate(routes.daoState);
        mutate(
          routes.listOfTippersById(data.id),
          async (tippers: any) => {
            const existingTipper = tippers.find(
              (tipper: any) =>
                tipper.account.pubkey.toString() ===
                tutorialProgram.provider.wallet.publicKey.toString(),
            );

            if (existingTipper) {
              const existingIndex = tippers.findIndex(
                (tipper: any) =>
                  tipper.account.pubkey.toString() ===
                  tutorialProgram.provider.wallet.publicKey.toString(),
              );
              const newTipper = tippers[existingIndex];
              newTipper.account.amount = newTipper.account.amount.add(amount);

              return [newTipper];
            }
            return [
              ...tippers,
              {
                account: newTip,
              },
            ];
          },
          {
            revalidate: false,
            populateCache: true,
            rollbackOnError: true,
          },
        );

        return txHash;
      } catch (err) {
        if (err instanceof Error) {
          console.log('Err:', err);
          setError(err);
        }

        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [tutorialProgram],
  );

  return [handleAction, { submitting, error }];
};
