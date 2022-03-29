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
  lastUpdatedAt: number;
  totalTips: number;
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

  async provision() {
    const searchableAttributes = [
      'title',
      'tags',
    ];
    const defaultRanking = [
      "typo",
      "geo",
      "words",
      "filters",
      "proximity",
      "attribute",
      "exact",
      "custom",
    ]
    const attributesForFaceting = [
      "difficulty",
      "state",
      "tags",
    ];

    const numberOfVotesAscReplica = this.client.initIndex(`${this.index.indexName}_numberOfVotes_asc`);
    const numberOfVotesDescReplica = this.client.initIndex(`${this.index.indexName}_numberOfVotes_desc`);
    const lastUpdatedAtAscReplica = this.client.initIndex(`${this.index.indexName}_lastUpdatedAt_asc`);
    const lastUpdatedAtDescReplica = this.client.initIndex(`${this.index.indexName}_lastUpdatedAt_desc`);
    const totalTipsAscReplica = this.client.initIndex(`${this.index.indexName}_totalTips_asc`);
    const totalTipsDescReplica = this.client.initIndex(`${this.index.indexName}_totalTips_desc`);

    await this.index.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "desc(lastUpdatedAt)",
        ...defaultRanking,
      ],
      replicas: [
        numberOfVotesAscReplica.indexName,
        numberOfVotesDescReplica.indexName,
        lastUpdatedAtAscReplica.indexName,
        lastUpdatedAtDescReplica.indexName,
        totalTipsAscReplica.indexName,
        totalTipsDescReplica.indexName,
      ]
    });


    await lastUpdatedAtAscReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "asc(lastUpdatedAt)",
        ...defaultRanking,
      ]
    });

    await lastUpdatedAtDescReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "desc(lastUpdatedAt)",
        ...defaultRanking,
      ]
    });

    await numberOfVotesAscReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "asc(numberOfVotes)",
        ...defaultRanking,
      ]
    });

    await numberOfVotesDescReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "desc(numberOfVotes)",
        ...defaultRanking,
      ]
    });

    await totalTipsAscReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "asc(totalTips)",
        ...defaultRanking,
      ]
    });

    await totalTipsDescReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "desc(totalTips)",
        ...defaultRanking,
      ]
    });
  }

  async delete() {
    const numberOfVotesAscReplica = this.client.initIndex(`${this.index.indexName}_numberOfVotes_asc`);
    const numberOfVotesDescReplica = this.client.initIndex(`${this.index.indexName}_numberOfVotes_desc`);
    const lastUpdatedAtAscReplica = this.client.initIndex(`${this.index.indexName}_lastUpdatedAt_asc`);
    const lastUpdatedAtDescReplica = this.client.initIndex(`${this.index.indexName}_lastUpdatedAt_desc`);
    const totalTipsAscReplica = this.client.initIndex(`${this.index.indexName}_totalTips_asc`);
    const totalTipsDescReplica = this.client.initIndex(`${this.index.indexName}_totalTips_desc`);

    await this.index.delete();

    await lastUpdatedAtAscReplica.delete();
    await lastUpdatedAtDescReplica.delete();
    await numberOfVotesAscReplica.delete();
    await numberOfVotesDescReplica.delete();
    await totalTipsAscReplica.delete();
    await totalTipsDescReplica.delete();
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
