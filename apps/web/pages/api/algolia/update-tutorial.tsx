// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { AlgoliaApi } from '@builderdao/apis';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_ADMIN_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from '@app/constants';

type ResponseData = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { id, ...data } = req.body;

  const algoliaApi = new AlgoliaApi({
    appId: NEXT_PUBLIC_ALGOLIA_APP_ID,
    accessKey: ALGOLIA_SEARCH_ADMIN_KEY,
    indexName: NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  });

  try {
    await algoliaApi.updateTutorial(id, data);
  } catch (err) {
    console.log('ERR', err);
  }

  res.status(200).json({
    success: true,
  });
}
