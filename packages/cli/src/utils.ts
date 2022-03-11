import { set, get } from 'lodash';
import prettyjson from 'prettyjson';
import * as anchor from '@project-serum/anchor';
import * as bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { promises as fs } from 'fs';
import crypto from 'crypto';

function stringifyPublicKeys(obj: any) {
  const result = {};
  const keys = Object.keys(obj);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keys.length; i++) {
    const val = obj[keys[i]];
    if (val?.toBuffer) {
      set(result, keys[i], val.toString());
    } else if (
      val instanceof Object &&
      Object.keys.length > 0 &&
      !Array.isArray(val)
    ) {
      set(result, keys[i], stringifyPublicKeys(val));
    } else {
      set(result, keys[i], val);
    }
  }
  return result;
}

export const log = (object: any, key = undefined) => {
  if (key) {
    console.log(stringifyPublicKeys({ [key]: get(object, key) })[key]);
  } else {
    console.log(prettyjson.render(stringifyPublicKeys(object)));
  }
};

export const createKeypairFromSecretKey = (secretKey: string) => {
  const array = Uint8Array.from(bs58.decode(secretKey));
  return anchor.web3.Keypair.fromSecretKey(array);
};

export const loadKeypairJson = async (path: string) =>
  Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        await fs.readFile(path, {
          encoding: 'utf8',
        }),
      ),
    ),
  );

export const hashSumDigest = async (path: string) => {
  const fileBuffer = await fs.readFile(path);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);

  return hashSum.digest('hex');
};
