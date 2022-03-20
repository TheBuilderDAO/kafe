import { PublicKey } from '@solana/web3.js';

export default {
  home: '/',
  learn: {
    index: '/learn',
    guide: slug => `/learn/${slug}`,
  },
  vote: {
    index: '/vote',
    propose: '/vote/propose',
    proposal: slug => `/vote/${slug}`,
  },
  write: {
    index: '/write',
  },
  api: {
    tags: {
      index: '/api/tags',
    },
    tutorials: {
      triggerWorkflow: '/api/tutorials/trigger-workflow',
    },
    algolia: {
      createTutorial: '/api/algolia/create-tutorial',
      updateTutorial: '/api/algolia/update-tutorial',
    },
    ceramic: {
      storeMetadata: '/api/ceramic/store-metadata',
    },
  },
  fetchers: {
    tutorials: {
      getBySlug: (slug: string) => ['api', 'tutorials', slug],
    },
  },
};
