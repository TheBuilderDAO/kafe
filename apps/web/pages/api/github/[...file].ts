import { getFileFromGithub } from '@app/lib/api/github';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * TO BE REMOVED. this is a temporary fix for the issue repo beign private.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { file } = req.query;
  const [slug, ...path] = file as string[];
  const raw = await getFileFromGithub(slug, path.join('/'));
  res.status(200).send(raw.data);
}
