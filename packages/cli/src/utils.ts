import * as _ from 'lodash';
import prettyjson from 'prettyjson';
import * as anchor from '@project-serum/anchor';
import { base58_to_binary, binary_to_base58 } from 'base58-js'
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
      _.set(result, keys[i], val.toString());
    } else if (
      val instanceof Object &&
      Object.keys.length > 0 &&
      !Array.isArray(val)
    ) {
      _.set(result, keys[i], stringifyPublicKeys(val));
    } else {
      _.set(result, keys[i], val);
    }
  }
  return result;
}

export const log = (object: any, key = undefined) => {
  if (key) {
    console.log(stringifyPublicKeys({ [key]: _.get(object, key) })[key]);
  } else {
    console.log(prettyjson.render(stringifyPublicKeys(object)));
  }
};

export const createKeypairFromSecretKey = (secretKey: string) => {
  const array = Uint8Array.from(base58_to_binary(secretKey));
  return anchor.web3.Keypair.fromSecretKey(array);
};

export const encodeKeypairSecretKey = (keypair: Keypair) => binary_to_base58(keypair.secretKey);

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


// eslint-disable-next-line no-promise-executor-return
export const sleep = async (ms: number) => new Promise( resolve => setTimeout(resolve, ms) )
