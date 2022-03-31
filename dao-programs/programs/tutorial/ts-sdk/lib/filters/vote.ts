import { numberToBytes } from '../utils';

enum VoteOffset {
  Id = 9,
}

export const filterVoteById = (id: number) => ({
  memcmp: {
    offset: VoteOffset.Id,
    bytes: numberToBytes(id),
  },
});
