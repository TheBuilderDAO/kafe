import {
  useGetHashmapTipperAccountListByIds,
  useGetHashmapVoterAccountListByIds,
} from '@builderdao-sdk/dao-program';
import _ from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';
import { connectHits } from 'react-instantsearch-dom';
import GuideHit from './GuideHit';

const _GuideHits = ({ hits }) => {
  const { error, loading, tippers } = useGetHashmapTipperAccountListByIds(
    hits.map(hit => hit.objectID),
  );
  useEffect(() => {
    console.log(tippers, error);
  }, [tippers, loading]);
  return (
    <>
      {hits.map((hit, index) => (
        <GuideHit
          key={`guide-hit-${index}-${hit.objectID}`}
          hit={hit}
          tippers={tippers ? tippers[hit.objectID] : []}
        />
      ))}
    </>
  );
};

export const GuideHits = connectHits(_GuideHits);
export default GuideHits;
