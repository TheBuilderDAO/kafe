import * as anchor from '@project-serum/anchor';
import { PublicKey, GetProgramAccountsFilter } from '@solana/web3.js';

import { publicKeyToBytes, numberToBytes } from '../utils';

enum TipperOffset {
  Id = 9,
  Publickey = 17,
}

export const filterTipperByPk = (pk: anchor.web3.PublicKey) => ({
  memcmp: {
    offset: TipperOffset.Publickey,
    bytes: publicKeyToBytes(pk),
  },
});

export const filterTipperById = (id: number): GetProgramAccountsFilter => ({
  memcmp: {
    offset: TipperOffset.Id,
    bytes: numberToBytes(id),
  },
});
