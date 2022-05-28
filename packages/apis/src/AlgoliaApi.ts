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
  publishedAt: number;
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
  private fulltextIndex: SearchIndex;

  constructor(config: ApiConfig) {
    this.client = algoliasearch(config.appId, config.accessKey);

    this.index = this.client.initIndex(config.indexName);
    this.fulltextIndex = this.client.initIndex('tutorial_full_text');
  }

  async provisionFullText() {
    const fullText = this.client.initIndex('tutorial_full_text')
    await fullText.setSettings({
      attributeForDistinct: 'section',
      distinct: 1,
    })
  }

  async addFulltextIndex(proposalId: string, objects: any[]) {
    await this.fulltextIndex.deleteBy({
      filters: `parentID = ${proposalId}`
    })
    await this.fulltextIndex.saveObjects(objects);
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

    const numberOfVotesAscReplica = this.client.initIndex(`${this.index.indexName}_number_of_votes_asc`);
    const numberOfVotesDescReplica = this.client.initIndex(`${this.index.indexName}_number_of_votes_desc`);
    const lastUpdatedAtAscReplica = this.client.initIndex(`${this.index.indexName}_last_updated_at_asc`);
    const lastUpdatedAtDescReplica = this.client.initIndex(`${this.index.indexName}_last_updated_at_desc`);
    const publishedAtAscReplica = this.client.initIndex(`${this.index.indexName}_published_at_asc`);
    const publishedAtDescReplica = this.client.initIndex(`${this.index.indexName}_published_at_desc`);
    const totalTipsAscReplica = this.client.initIndex(`${this.index.indexName}_total_tips_asc`);
    const totalTipsDescReplica = this.client.initIndex(`${this.index.indexName}_total_tips_desc`);

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
        publishedAtAscReplica.indexName,
        publishedAtDescReplica.indexName,
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

    await publishedAtAscReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "asc(publishedAt)",
        ...defaultRanking,
      ]
    });

    await publishedAtDescReplica.setSettings({
      searchableAttributes,
      attributesForFaceting,
      ranking: [
        "desc(publishedAt)",
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
    const numberOfVotesAscReplica = this.client.initIndex(`${this.index.indexName}_number_of_votes_asc`);
    const numberOfVotesDescReplica = this.client.initIndex(`${this.index.indexName}_number_of_votes_desc`);
    const lastUpdatedAtAscReplica = this.client.initIndex(`${this.index.indexName}_last_updated_at_asc`);
    const lastUpdatedAtDescReplica = this.client.initIndex(`${this.index.indexName}_last_updated_at_desc`);
    const publishedAtAscReplica = this.client.initIndex(`${this.index.indexName}_published_at_asc`);
    const publishedAtDescReplica = this.client.initIndex(`${this.index.indexName}_published_at_desc`);
    const totalTipsAscReplica = this.client.initIndex(`${this.index.indexName}_total_tips_asc`);
    const totalTipsDescReplica = this.client.initIndex(`${this.index.indexName}_total_tips_desc`);

    await this.index.delete();

    await lastUpdatedAtAscReplica.delete();
    await lastUpdatedAtDescReplica.delete();
    await publishedAtAscReplica.delete();
    await publishedAtDescReplica.delete();
    await numberOfVotesAscReplica.delete();
    await numberOfVotesDescReplica.delete();
    await totalTipsAscReplica.delete();
    await totalTipsDescReplica.delete();
  }

  async createTutorial(record: Partial<TutorialIndex>) {
    await this.index.saveObject(record).wait();
  }

  async upsertTutorials(records: Array<Partial<TutorialIndex>>) {
    return this.index.partialUpdateObjects(records, { createIfNotExists: true }).wait();
  }

  async deleteTutorials(records: string[]) {
    return this.index.deleteObjects(records)
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
