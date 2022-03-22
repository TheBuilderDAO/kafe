import { getFileFromGithub } from '@app/lib/api/github';
import { NextApiRequest, NextApiResponse } from 'next';
import mime from 'mime-types';

const YEAR_SECONDS = 31536000;
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

  res
    .status(200)
    .setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=${YEAR_SECONDS}, max-age=${YEAR_SECONDS}`,
    )
    .setHeader('Content-Type', mime.contentType(mime.lookup(path.join('/'))))
    .end(raw);
}
