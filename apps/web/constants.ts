import { TutorialProgramConfig } from '@builderdao-sdk/dao-program';

const getEnvOrFail = <T>(key: string, optional = false): T => {
  const val = process.env[key];
  if (val) {
    return val as unknown as T;
  } else {
    if (!optional) {
      throw Error(`Environment variable ${key} is not set`);
    }
  }
};

export const NODE_ENV = getEnvOrFail<string>('NODE_ENV');

export const ALGOLIA_SEARCH_ADMIN_KEY = getEnvOrFail<string>(
  'ALGOLIA_SEARCH_ADMIN_KEY',
);
export const ARWEAVE_REQUIRED_CONFIRMATIONS = 2;
export const CERAMIC_SEED = getEnvOrFail<string>('CERAMIC_SEED');
export const NEXT_PUBLIC_ALGOLIA_APP_ID = getEnvOrFail<string>(
  'NEXT_PUBLIC_ALGOLIA_APP_ID',
);
export const NEXT_PUBLIC_ALGOLIA_INDEX_NAME = getEnvOrFail<string>(
  'NEXT_PUBLIC_ALGOLIA_INDEX_NAME',
);
export const NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY = getEnvOrFail<string>(
  'NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY',
);
export const NEXT_PUBLIC_CERAMIC_NODE_URL = getEnvOrFail<string>(
  'NEXT_PUBLIC_CERAMIC_NODE_URL',
);
export const NEXT_PUBLIC_KAFE_MINT = getEnvOrFail<string>(
  'NEXT_PUBLIC_KAFE_MINT',
);
export const NEXT_PUBLIC_SOLANA_NETWORK =
  getEnvOrFail<TutorialProgramConfig.Network>('NEXT_PUBLIC_SOLANA_NETWORK');
export const NEXT_PUBLIC_SOLANA_NODE_URL = getEnvOrFail<string>(
  'NEXT_PUBLIC_SOLANA_NODE_URL',
  true,
);
export const ZERO_ADDRESS = '11111111111111111111111111111111';

export const NEXT_PUBLIC_ARWEAVE_APP_NAME = getEnvOrFail<string>(
  'NEXT_PUBLIC_ARWEAVE_APP_NAME',
);
export const NEXT_PUBLIC_ARWEAVE_HOST = getEnvOrFail<string>(
  'NEXT_PUBLIC_ARWEAVE_HOST',
);
export const NEXT_PUBLIC_ARWEAVE_PORT = getEnvOrFail<string>(
  'NEXT_PUBLIC_ARWEAVE_PORT',
);
export const NEXT_PUBLIC_ARWEAVE_PROTOCOL = getEnvOrFail<string>(
  'NEXT_PUBLIC_ARWEAVE_PROTOCOL',
);
