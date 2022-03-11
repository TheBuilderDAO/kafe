import { useDapp } from './../hooks/useDapp';
import { Tutorial } from '@app/types/index';
import { SolanaApi, CeramicApi } from '@builderdao/apis';
import tags from '../data/tags';
import useSWR from 'swr';
import routes from 'routes';

class ApplicationFetcher {
  constructor(private solanaApi: SolanaApi, private ceramicApi: CeramicApi) {}

  async getTags(): Promise<string[]> {
    return tags;
  }

  async getCeramicMetadata(streamId: string) {
    return await this.ceramicApi.getMetadata(streamId);
  }

  async getTutorialBySlug(slug: string): Promise<Tutorial> {
    const proposalAccount =
      await this.solanaApi.tutorialProgram.getTutorialBySlug(slug);
    const streamId = proposalAccount.streamId.toString();

    const metadata = await this.getCeramicMetadata(streamId);

    return {
      id: proposalAccount.id.toNumber(),
      state: Object.keys(proposalAccount.state)[0],
      slug: proposalAccount.slug.toString(),
      createdAt: proposalAccount.createdAt.toNumber(),
      creator: proposalAccount.creator.toString(),
      reviewer1: proposalAccount.reviewer1.toString(),
      reviewer2: proposalAccount.reviewer2.toString(),
      ...metadata,
    };
  }
}

export const useGetTutorialBySlugWithMetadata = (slug: string) => {
  const { applicationFetcher } = useDapp();
  const { data, error } = useSWR(
    routes.fetchers.tutorials.getBySlug(slug),
    async () => applicationFetcher.getTutorialBySlug(slug as string),
  );
  return {
    data,
    loading: !data && !error,
    error,
  };
};

export default ApplicationFetcher;
