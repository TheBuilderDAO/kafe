// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { CeramicApi } from '@builderdao/apis';

type ResponseData = {
  streamId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const metadata = req.body;

    const ceramicApi = new CeramicApi({
      nodeUrl: process.env.NEXT_PUBLIC_CERAMIC_NODE_URL as string,
      seed: process.env.CERAMIC_SEED as string,
    });

    const doc = await ceramicApi.storeMetadata(metadata);

    res.status(200).json({
      streamId: doc.id.toString(),
    });
  } catch (err) {
    console.log('ERR', err);
    res.status(500).json(err);
  }
}
