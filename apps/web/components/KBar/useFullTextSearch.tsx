import _ from 'lodash';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSearchBox, useHits } from 'react-instantsearch-hooks';
import { useKBar, useRegisterActions, createAction, Action } from 'kbar';

import { HashtagIcon } from '@app/components/SVG/Hashtag';
import { DocumentIcon } from '@app/components/SVG/Document';
import { CodeIcon } from '@app/components/SVG/Code';
import { ListIcon } from '@app/components/SVG/List';
import { HitTreeIcon } from '@app/components/SVG/HitTree';
import { SearchIcon } from '@app/components/SVG/Search';
import { useCallback } from 'react';

export const useFullTextSearch = () => {
  const { query, refine: setQuery, clear } = useSearchBox();
  const { hits } = useHits<{ type: HitTypes; permalink: string }>();
  const router = useRouter();
  const formatHitTitle = useCallback(
    h => {
      const h1 = _.get(h, 'h1', '');
      const h2 = _.get(h, 'h2', '');
      const h3 = _.get(h, 'h3', '');
      return [h1, h2, h3].filter(Boolean).join(' > ');
    },
    [query],
  );
  const formatMatchedWods = h => {
    return _.uniq([
      ..._.get(h, '_highlightResult.h1.matchedWords', []),
      ..._.get(h, '_highlightResult.h2.matchedWords', []),
      ..._.get(h, '_highlightResult.h3.matchedWords', []),
      ..._.get<string[]>(h, '_highlightResult.content.matchedWords', []),
    ]).join(', ');
  };
  const formatted = useMemo(
    () =>
      hits.map(h => ({
        id: h.objectID,
        name: formatHitTitle(h),
        keywords: formatMatchedWods(h),
        parent: 'learn',
        section: 'Learn',
        perform: () => router.push(h.permalink),
        icon: <HitIcon type={h.type} />,
        hit: h,
      })),
    [hits, query],
  );
  var debounced = _.debounce(setQuery, 250, { maxWait: 600 });
  const { options } = useKBar(state => {
    if (state.currentRootActionId === 'learn') {
      debounced(state.searchQuery);
    }
  });

  useRegisterActions(
    [
      {
        id: 'learn',
        name: 'Search guides…',
        shortcut: ['?'],
        keywords: 'find',
        section: 'Learn',
        priority: 1,
        icon: <SearchIcon />,
      },
      ...formatted.map(f => createAction(f)),
    ].filter(Boolean) as Action[],
    [hits],
  );
};

export type HitTypes = 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'code' | 'paragraph';

const HitIcon: React.FC<{
  type: HitTypes;
}> = ({ type }) => {
  switch (type) {
    case 'lvl1':
      return <DocumentIcon />;
    case 'code':
      return <CodeIcon />;
    case 'paragraph':
      return <ListIcon />;
    default:
      return (
        <div className="flex ">
          <HitTreeIcon />
          <HashtagIcon />
        </div>
      );
  }
};
