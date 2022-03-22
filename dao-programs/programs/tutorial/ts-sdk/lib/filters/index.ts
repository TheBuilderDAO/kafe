import * as bs58 from 'bs58';

import { ProposalStateE } from '../instructions/proposalSetState';

enum ProposalAccountOffset {
  State = 129,
  Slug = 134,
}

const stringToBytes = (str: string) => bs58.encode(Buffer.from(str));

export const proposalStateEtoBytes = (state: ProposalStateE) => {
  switch (state) {
    case ProposalStateE.submitted:
      return bs58.encode(new Uint8Array([0]));
    case ProposalStateE.funded:
      return bs58.encode(new Uint8Array([1]));
    case ProposalStateE.writing:
      return bs58.encode(new Uint8Array([3]));
    case ProposalStateE.readyToPublish:
      return bs58.encode(new Uint8Array([4]));
    case ProposalStateE.published:
      return bs58.encode(new Uint8Array([5]));
    default:
      throw new Error('Invalid State');
  }
};

export const filterAccountByFundedState = {
  memcmp: {
    offset: ProposalAccountOffset.State,
    bytes: proposalStateEtoBytes(ProposalStateE.funded),
  },
};

export const filterAccountByReadyToPublishState = {
  memcmp: {
    offset: ProposalAccountOffset.State,
    bytes: proposalStateEtoBytes(ProposalStateE.readyToPublish),
  },
};

export const filterAccountBySlug = (slug: string) => ({
  memcmp: {
    offset: ProposalAccountOffset.Slug,
    bytes: stringToBytes(slug),
  },
});
