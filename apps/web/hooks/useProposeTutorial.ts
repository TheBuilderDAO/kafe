import { useCallback, useState } from 'react';
import { useDapp } from './useDapp';
import useApiCall from './useApiCall';
import routes from '../routes';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import {
  useProposeTutorial as solanaUseProposeTutorial,
  useTutorialProgram,
} from '@builderdao-sdk/dao-program';
import { TutorialMetadata } from '@builderdao/apis/src';
import { captureException } from '@app/utils/errorLogging';

type StoreMetadataResponse = {
  did: string;
  streamId: string;
};

export const useProposeTutorial = <AD>(): [
  (data: AD) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState(null);

  const {
    wallet: { publicKey },
  } = useDapp();
  const tutorialProgram = useTutorialProgram();

  const [proposeTutorial] = solanaUseProposeTutorial();
  const [createIndexRecord] = useApiCall<any, any>(
    routes.api.algolia.createTutorial,
  );
  const [storeMetadata] = useApiCall<TutorialMetadata, StoreMetadataResponse>(
    routes.api.ceramic.storeMetadata,
  );

  const handleAction = useCallback(
    async data => {
      if (!publicKey) throw new WalletNotConnectedError();

      try {
        setError(null);
        setSubmitting(true);

        const daoAccount = await tutorialProgram.getDaoAccount();
        const id = daoAccount.nonce.toNumber();

        // Store Metadata to Ceramic. Get CID
        const { streamId } = await storeMetadata({
          data: {
            title: data.title,
            slug: data.slug,
            description: data.description,
            difficulty: data.difficulty,
            tags: data.tags,
            createdAt: Date.now(),
          },
        });

        console.log('StreamID', streamId);

        // Create tutorial in Solana program
        const txHash = await proposeTutorial({
          id,
          userPk: publicKey,
          slug: data.slug,
          streamId,
        });

        console.log('TX Hash', txHash);

        await createIndexRecord({
          data: {
            id: id.toString(),
            slug: data.slug,
            title: data.title,
            description: data.description,
            author: publicKey.toString(),
            difficulty: data.difficulty,
            tags: data.tags,
            lastUpdatedAt: Date.now(),
          },
        });
      } catch (err) {
        console.log('ERR:', err);
        captureException(err);
        setError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [
      publicKey,
      tutorialProgram,
      storeMetadata,
      proposeTutorial,
      createIndexRecord,
    ],
  );

  return [handleAction, { submitting, error }];
};
