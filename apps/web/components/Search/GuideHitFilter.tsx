import React from 'react';
import { components, ControlProps } from 'react-select';
import SortBy from '@app/components/Search/SortBy';
import RefinementList from './RefinementList';
import MenuSelect from './MenuSelect';
import { NEXT_PUBLIC_ALGOLIA_INDEX_NAME } from '@app/constants';
import { useTheme } from 'next-themes';
import getCustomStyles from '../../utils/getCustomStyles';

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}> {children}</components.Control>
);

const GuideHitFilter = () => {
  const { theme } = useTheme();
  const customStyles = getCustomStyles(theme);
  return (
    <div className="divide-y-2 dark:divide-kafeblack divide-kafewhite">
      <div className="px-10 pt-5">
        <p className="text-kafemellow text-xs">sort by</p>
        <SortBy
          defaultRefinement={`${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_total_tips_desc`}
          items={[
            {
              value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_total_tips_desc`,
              label: 'Most support',
            },
            {
              value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_total_tips_asc`,
              label: 'Least support',
            },
            {
              value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_published_at_desc`,
              label: 'Newest',
            },
            {
              value: `${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_published_at_asc`,
              label: 'Oldest',
            },
          ]}
          Control={Control}
          customStyles={customStyles}
          instanceId="sort-by"
        />
      </div>
      <div className="px-10 pt-5">
        <p className="text-kafemellow">technologies</p>
        <RefinementList
          attribute="tags"
          Control={Control}
          customStyles={customStyles}
          limit={50}
        />
      </div>
      <div className="px-10 pt-5">
        <p className="text-kafemellow pb-5">difficulty</p>
        <MenuSelect attribute="difficulty" />
      </div>
    </div>
  );
};

export default GuideHitFilter;
