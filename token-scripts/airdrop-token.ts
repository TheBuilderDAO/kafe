import { transferIx } from './utils/token-service';
import {
  parseCsv,
  toBaseUnit,
  getTokenInfo,
  getConnection,
  getAta,
} from './utils/helper';
import { ParsedCsvEntryT, TransferEntryT } from './utils/type';
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';

import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const csvPath = process.env.AIRDROP_FILE;
  if (!csvPath) {
    console.error('airdrop.csv is missing');
  }

  const tokensInfo = getTokenInfo();
  const valideSymbols = Array.from(tokensInfo.keys());

  const transformCsvEntryToTransferEntry = async (
    entry: ParsedCsvEntryT,
  ): Promise<TransferEntryT> => {
    const tokenInfo = tokensInfo.get(entry.symbol)!;
    const authority = tokenInfo.authority;
    const decimals = tokenInfo.decimals;
    const mintPk = tokenInfo.keypair.publicKey;
    const fromAta = await getAta(authority.publicKey, mintPk);
    const ownerPk = new PublicKey(entry.pk);
    const toAta = await getAta(ownerPk, mintPk);
    const amountInBaseUnit = toBaseUnit(parseInt(entry.amount), decimals);
    const freeze = tokenInfo.freeze;

    return {
      mintPk,
      authority,
      payer: authority,
      fromAta,
      toAta,
      ownerPk,
      amountInBaseUnit,
      decimals,
      freeze,
    };
  };

  const transferEntry = await Promise.all(
    parseCsv(csvPath!)
      .filter(entry => valideSymbols.includes(entry.symbol))
      .map(transformCsvEntryToTransferEntry),
  );

  const connection = getConnection();
  let transaction: Transaction;
  let signers: Keypair[];

  const bulkSize = 5;
  for (let index = 0; index < transferEntry.length; index += bulkSize) {
    transaction = new Transaction();
    signers = [];

    transferEntry.slice(index, index + bulkSize).forEach((entry, _index) => {
      transferIx(transaction, signers, entry);
    });

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
    );
    console.log(signature);
  }
};

main()
  .then(console.log)
  .catch(error => console.error((error as Error).message));
