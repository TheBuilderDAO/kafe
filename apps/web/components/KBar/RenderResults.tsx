import { KBarResults, useMatches } from 'kbar';
import tw from 'tailwind-styled-components';
import { ResultItem } from './ResultItem';

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
          <ResultItem action={item} active={active} />
        )
      }
    />
  );
};

const GroupName = tw.div`text-lg font-bold text-kafegold`;
