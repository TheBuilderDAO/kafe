// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { GitHubApi } from '@builderdao/apis';

type ResponseData = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { slug } = req.body;

  const gitHubApi = new GitHubApi();

  await gitHubApi.triggerWorkflow(slug);

  res.status(200).json({ success: true });
}
