import { PublicKey } from '@solana/web3.js';

export default {
  home: '/',
  learn: {
    index: '/learn',
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
      createIndexRecord: '/api/tutorials/create-index-record',
      triggerWorkflow: '/api/tutorials/trigger-workflow',
      storeMetadata: '/api/tutorials/store-metadata',
      updateIndexRecord: '/api/tutorials/update-index-record',
    },
  },
  fetchers: {
    tutorials: {
      getBySlug: (slug: string) => ['api', 'tutorials', slug],
    },
  },
};
