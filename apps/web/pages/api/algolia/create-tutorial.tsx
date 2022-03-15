// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { TutorialIndex, TutorialState } from '@app/types/index';
import { AlgoliaApi } from '@builderdao/apis';
import { ProposalStateE } from '@builderdao-sdk/dao-program'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TutorialIndex>,
) {
  const { id, title, description, author, slug, tags, difficulty } = req.body;

  try {
    const algoliaApi = new AlgoliaApi({
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      accessKey: process.env.ALGOLIA_SEARCH_ADMIN_KEY as string,
      indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME as string,
    });

    const record = {
      objectID: id,
      state: ProposalStateE.submitted,
      title,
      description,
      author,
      slug,
      tags,
      difficulty,
      numberOfVotes: 0,
    };

    await algoliaApi.createTutorial(record);

    res.status(200).json(record);
  } catch (err) {
    console.log('ERR', err);
    res.status(500).json(err);
  }
}
