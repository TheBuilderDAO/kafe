import { ActionImpl, KBarResults, useMatches } from 'kbar';
import tw from 'tailwind-styled-components';
import { ResultItem } from './ResultItem';
import { HitResult } from './useFullTextSearch';

export const RenderResults: React.FC = () => {
  const { results } = useMatches();

  return (
    <KBarResults
      maxHeight={600}
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <GroupName>{item}</GroupName>
        ) : (
          <ResultItem
            action={item as ActionImpl & { hit?: HitResult }}
            active={active}
          />
        )
      }
    />
  );
};

const GroupName = tw.div`text-lg font-bold text-kafegold`;
