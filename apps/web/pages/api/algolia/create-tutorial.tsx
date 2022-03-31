// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { TutorialIndex } from '@app/types/index';
import { AlgoliaApi } from '@builderdao/apis';
import { ProposalStateE } from '@builderdao-sdk/dao-program';
import {
  ALGOLIA_SEARCH_ADMIN_KEY,
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from '@app/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TutorialIndex>,
) {
  const {
    id,
    title,
    description,
    author,
    slug,
    tags,
    difficulty,
    lastUpdatedAt,
  } = req.body;

  try {
    const algoliaApi = new AlgoliaApi({
      appId: NEXT_PUBLIC_ALGOLIA_APP_ID,
      accessKey: ALGOLIA_SEARCH_ADMIN_KEY,
      indexName: NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
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
      totalTips: 0,
      lastUpdatedAt,
    };

    await algoliaApi.createTutorial(record);

    res.status(200).json(record);
  } catch (err) {
    console.log('ERR', err);
    res.status(500).json(err);
  }
}
