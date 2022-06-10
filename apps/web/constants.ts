import { TutorialProgramConfig } from '@builderdao/program-tutorial';

const getEnvOrFail = <T>(
  val: string | number | undefined,
  key: string,
  optional = false,
): T => {
  if (val) {
    return val as unknown as T;
  } else {
    if (key.startsWith('NEXT_PUBLIC') && !optional) {
      throw new Error(`Missing env ${key}`);
    } else if (
      !key.startsWith('NEXT_PUBLIC') &&
      !process.browser &&
      !optional
    ) {
      throw new Error(`Missing env ${key}`);
    }
  }
};

export const NODE_ENV = getEnvOrFail<string>(process.env.NODE_ENV, 'NODE_ENV');

export const ALGOLIA_ADMIN_KEY = getEnvOrFail<string>(
  process.env.ALGOLIA_ADMIN_KEY,
  'ALGOLIA_ADMIN_KEY',
  true,
);
export const ARWEAVE_REQUIRED_CONFIRMATIONS = 2;
export const CERAMIC_SEED = getEnvOrFail<string>(
  process.env.CERAMIC_SEED,
  'CERAMIC_SEED',
  true,
);
export const NEXT_PUBLIC_ALGOLIA_APP_ID = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  'NEXT_PUBLIC_ALGOLIA_APP_ID',
);
export const NEXT_PUBLIC_ALGOLIA_INDEX_NAME = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  'NEXT_PUBLIC_ALGOLIA_INDEX_NAME',
);
export const NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  'NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY',
);
export const NEXT_PUBLIC_CERAMIC_NODE_URL = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_CERAMIC_NODE_URL,
  'NEXT_PUBLIC_CERAMIC_NODE_URL',
);
export const NEXT_PUBLIC_KAFE_MINT = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_KAFE_MINT,
  'NEXT_PUBLIC_KAFE_MINT',
);
export const NEXT_PUBLIC_BDR_MINT = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_BDR_MINT,
  'NEXT_PUBLIC_BDR_MINT',
);
export const NEXT_PUBLIC_SOLANA_NETWORK =
  getEnvOrFail<TutorialProgramConfig.Network>(
    process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    'NEXT_PUBLIC_SOLANA_NETWORK',
  );
export const NEXT_PUBLIC_SOLANA_NODE_URL = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_SOLANA_NODE_URL,
  'NEXT_PUBLIC_SOLANA_NODE_URL',
  true,
);

export const ZERO_ADDRESS = '11111111111111111111111111111111';

export const NEXT_PUBLIC_ARWEAVE_APP_NAME = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME,
  'NEXT_PUBLIC_ARWEAVE_APP_NAME',
);
export const NEXT_PUBLIC_ARWEAVE_HOST = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ARWEAVE_HOST,
  'NEXT_PUBLIC_ARWEAVE_HOST',
);
export const NEXT_PUBLIC_ARWEAVE_PORT = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ARWEAVE_PORT,
  'NEXT_PUBLIC_ARWEAVE_PORT',
);
export const NEXT_PUBLIC_ARWEAVE_PROTOCOL = getEnvOrFail<string>(
  process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL,
  'NEXT_PUBLIC_ARWEAVE_PROTOCOL',
);

export const AVATAR_SIZE = 25;
