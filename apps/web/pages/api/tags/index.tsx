// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

import { getApplicationFetcher } from '../../../hooks/useDapp';

type ResponseData = string[];

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const fetcher = getApplicationFetcher();

  const tags = await fetcher.getTags();

  res.status(200).json(tags);
};

export default withSentry(handler);
