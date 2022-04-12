// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

import { CeramicApi } from '@builderdao/apis';
import { CERAMIC_SEED, NEXT_PUBLIC_CERAMIC_NODE_URL } from '@app/constants';
import { captureException } from '@app/utils/errorLogging';

type ResponseData = {
  streamId: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  try {
    const metadata = req.body;

    const ceramicApi = new CeramicApi({
      nodeUrl: NEXT_PUBLIC_CERAMIC_NODE_URL,
    });

    ceramicApi.setSeed(CERAMIC_SEED);

    const doc = await ceramicApi.storeMetadata(metadata);

    res.status(200).json({
      streamId: doc.id.toString(),
    });
  } catch (err) {
    console.log('ERR', err);
    captureException(err);
    res.status(500).json(err);
  }
};

export default withSentry(handler);
