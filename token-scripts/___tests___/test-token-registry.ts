import { TokenListProvider, Strategy } from '@solana/spl-token-registry';

(async () => {
  const TokenProvider = await new TokenListProvider().resolve(Strategy.CDN);
  const tokenList = TokenProvider.filterByChainId(103).getList();
  console.log(JSON.stringify(tokenList.map(x => x.symbol).sort(), null, 2));
})();
