import { Program, Provider } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterTipperById } from '../filters';
import _ from 'lodash';
import {
  createRpcBatchRequest,
  getProgramAccountArgs,
  RpcParams,
} from '../utils';

export const tipperAccountListHashmapByIds = async (
  program: Program<Tutorial>,
  provider: Provider,
  tutorialIds: number[],
) => {
  const requests = tutorialIds.map((id: number): RpcParams => {
    const filters = [filterTipperById(id)];
    return {
      id: id.toString(),
      methodName: 'getProgramAccounts',
      args: getProgramAccountArgs(program.programId, provider, { filters }),
    };
  });

  const customRpcRequest = createRpcBatchRequest(
    provider.connection._rpcClient,
  );
  const decodeResults = (accountName: string, results: any[]) =>
    results.map(({ pubkey, account }) => {
      return {
        publicKey: pubkey,
        account: program.coder.accounts.decodeUnchecked(
          accountName,
          Buffer.from(account.data[0]),
        ),
      };
    });
  const results = await customRpcRequest(requests);
  return results.reduce((prev, resp) => {
    prev[resp.id] = decodeResults(
      program.account.tipperAccount._idlAccount.name,
      resp.result,
    );
    return prev;
  }, {});
};

export default tipperAccountListHashmapByIds;
