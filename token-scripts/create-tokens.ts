import { fromConfig, getConnection, loadTokens, getAta } from './utils/helper';
import { createToken, getMintRentExempt } from './utils/mint-service';

import dotenv from 'dotenv';
dotenv.config();

const mintTokensWithSupply = async (tokenConfig: any) => {
  const { authority, mint, decimals, supplyInBaseUnit, symbol, supply } =
    fromConfig(tokenConfig);

  const connection = getConnection();
  const rentExempt = await getMintRentExempt(connection);
  const authorityAta = await getAta(authority.publicKey, mint.publicKey);

  const signature = await createToken({
    connection,
    mint,
    authority,
    authorityAta,
    decimals,
    supplyInBaseUnit,
    rentExempt,
  });

  console.log({
    symbol,
    mint: mint.publicKey.toString(),
    authority: authority.publicKey.toString(),
    authorityAta: authorityAta.toString(),
    decimal: decimals,
    supply,
    signature,
  });
};

const main = async () => {
  await Promise.all(loadTokens().map(mintTokensWithSupply));
};

main().catch(error => console.error((error as Error).message));
