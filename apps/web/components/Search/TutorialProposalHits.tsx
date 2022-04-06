import { useGetHashmapVoterAccountListByIds } from '@builderdao-sdk/dao-program';
import { connectHits } from 'react-instantsearch-dom';
import TutorialProposalHit from './TutorialProposalHit';

const _TutorialProposalHits = ({ hits }) => {
  const { error, loading, voters } = useGetHashmapVoterAccountListByIds(
    hits.map(hit => hit.objectID),
  );

  return (
    <>
      {hits.map((hit, index) => (
        <TutorialProposalHit
          key={`proposalHit-${index}`}
          hit={hit}
          voters={voters ? voters[hit.objectID] : []}
        />
      ))}
    </>
  );
};

export const TutorialProposalHits = connectHits(_TutorialProposalHits);
export default TutorialProposalHits;
