import * as bs58 from 'bs58';

import { ProposalStateE } from '../instructions/proposalSetState';
import { numberToBytes, stringToBytes } from '../utils';

enum ProposalOffset {
  Id = 9,
  State = 145,
  StreamId = 150,
  Slug = 217,
}

const proposalStateEtoBytes = (state: ProposalStateE) => {
  switch (state) {
    case ProposalStateE.submitted:
      return bs58.encode(new Uint8Array([0]));
    case ProposalStateE.funded:
      return bs58.encode(new Uint8Array([1]));
    case ProposalStateE.writing:
      return bs58.encode(new Uint8Array([2]));
    case ProposalStateE.readyToPublish:
      return bs58.encode(new Uint8Array([3]));
    case ProposalStateE.published:
      return bs58.encode(new Uint8Array([4]));
    default:
      throw new Error('Invalid State');
  }
};

export const filterProposalById = (id: number) => ({
  memcmp: {
    offset: ProposalOffset.Id,
    bytes: numberToBytes(id),
  },
});

export const filterProposalByState = (state: ProposalStateE) => ({
  memcmp: {
    offset: ProposalOffset.State,
    bytes: proposalStateEtoBytes(state),
  },
});

export const filterProposalBySlug = (slug: string) => {
  const dataSize = ProposalOffset.Slug + slug.length;
  return [
    {
      dataSize,
    },
    {
      memcmp: {
        offset: ProposalOffset.Slug,
        bytes: stringToBytes(slug),
      },
    },
  ];
};

export const filterProposalByStreamId = (streamId: string) => ({
  memcmp: {
    offset: ProposalOffset.StreamId,
    bytes: stringToBytes(streamId),
  },
});
