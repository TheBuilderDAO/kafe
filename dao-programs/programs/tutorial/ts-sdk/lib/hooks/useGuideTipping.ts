import { useCallback, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { mutate } from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

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
    async data => {
      try {
        setError(null);
        setSubmitting(true);

        console.log('GUIDEEE TIPPING', data);
        const txHash = await tutorialProgram?.guideTipping({
          id: data.id,
          tipperPk: data.tipperPk,
          amount: new anchor.BN(data.amount),
        });

        console.log('TX Hash', txHash);

        mutate(routes.daoState);

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
