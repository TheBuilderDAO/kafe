import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

export type TutorialIndex = {
  objectID: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  state: string;
  tags: string[];
  difficulty: string;
  numberOfVotes: number;
  funded: boolean;
};

export type ApiConfig = {
  appId: string;
  accessKey: string;
  indexName: string;
};

class AlgoliaApi {
  private client: SearchClient;

  private index: SearchIndex;

  constructor(config: ApiConfig) {
    this.client = algoliasearch(config.appId, config.accessKey);

    this.index = this.client.initIndex(config.indexName);
  }

  async createTutorial(record: Partial<TutorialIndex>) {
    await this.index.saveObject(record).wait();
  }

  async updateTutorial(objectID: string, record: Partial<TutorialIndex>) {
    await this.index
      .partialUpdateObject({
        objectID,
        ...record,
      })
      .wait();
  }
}

export default AlgoliaApi;
