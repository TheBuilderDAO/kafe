// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getApplicationFetcher } from '../../../hooks/useDapp';

type ResponseData = string[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const fetcher = getApplicationFetcher();

  const tags = await fetcher.getTags();

  res.status(200).json(tags);
}
