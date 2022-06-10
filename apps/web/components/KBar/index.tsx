import React from 'react';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  Action,
  useRegisterActions,
  useKBar,
  createAction,
} from 'kbar';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import { InstantSearch } from 'react-instantsearch-hooks';
import algoliasearch from 'algoliasearch';

import _ from 'lodash';

import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import { CopyIcon } from '../SVG/Copy';
import { HomeIcon } from '../SVG/Home';
import { InboxInIcon } from '../SVG/InboxIn';
import { PencilAltIcon } from '../SVG/PencilAlt';
import { BookOpenIcon } from '../SVG/BookOpen';
import { useThemeActions } from './useThemeActions';
import { useFullTextSearch } from './useFullTextSearch';
import { RenderResults } from './RenderResults';
import { DiscordIcon } from '../SVG/Discord';
import { TwitterIcon } from '../SVG/Twitter';
import { GithubIcon } from '../SVG/Github';

const Positioner = tw(
  KBarPositioner,
)`z-30 min-w-xl flex items-start justify-center w-full pt-[14vh] py-4 pb-4 dark:bg-kafedarker bg-kafelighter  bg-opacity-80 inset-0 fixed box-border`;
const Search = tw(KBarSearch)`w-full py-3 px-4 mb-4`;
const Animator = tw(
  KBarAnimator,
)`max-w-3xl bg-kafeblack p-4 w-full rounded overflow-hidden shadow-lg min-h-[40rem] z-50`;

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

export const KBar: React.FC = ({ children }) => {
  const router = useRouter();
  const actions: Action[] = [
    {
      id: 'copy',
      name: 'Copy URL',
      shortcut: ['u'],
      keywords: 'copy-url',
      section: 'General',
      perform: () => navigator.clipboard.writeText(window.location.href),
      icon: <CopyIcon />,
    },
    {
      id: 'home',
      name: 'Home',
      shortcut: ['g', 'h'],
      keywords: 'go-home',
      section: 'Go To',
      perform: () => router.push('/'),
      icon: <HomeIcon />,
    },
    {
      id: 'go-to-learn',
      name: 'Learn',
      shortcut: ['g', 'l'],
      section: 'Go To',
      keywords: 'learn',
      perform: () => router.push('/learn'),
      icon: <BookOpenIcon />,
    },
    {
      id: 'vote',
      name: 'Vote',
      shortcut: ['g', 'v'],
      section: 'Go To',
      keywords: 'vote',
      perform: () => router.push('/vote'),
      icon: <InboxInIcon />,
    },
    {
      id: 'write',
      name: 'Write',
      shortcut: ['g', 'w'],
      section: 'Go To',
      keywords: 'write',
      perform: () => router.push('/write'),
      icon: <PencilAltIcon />,
    },
    {
      id: 'discord',
      name: 'Join our Discord',
      shortcut: ['d'],
      section: 'Follow',
      keywords: 'discord, join',
      perform: () => window.open('https://discord.builderdao.io', '_blank'),
      icon: <DiscordIcon />,
    },
    {
      id: 'twitter',
      name: 'Follow @TheBuilderDAO on Twitter',
      shortcut: ['t'],
      section: 'Follow',
      keywords: 'twitter, follow',
      perform: () =>
        window.open(
          'https://twitter.com/intent/user?screen_name=TheBuilderDAO',
          '_blank',
        ),
      icon: <TwitterIcon />,
    },
    {
      id: 'github',
      name: 'Give a star on Github',
      shortcut: ['g', 'g'],
      section: 'Follow',
      keywords: 'github, star, follow',
      perform: () =>
        window.open('https://github.com/TheBuilderDAO/kafe', '_blank'),
      icon: <GithubIcon />,
    },
  ];
  return (
    <InstantSearch searchClient={searchClient} indexName={'tutorial_full_text'}>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <Positioner>
            <KBarInternal />
          </Positioner>
        </KBarPortal>
        {children}
      </KBarProvider>
    </InstantSearch>
  );
};

const KBarInternal: React.FC = () => {
  useFullTextSearch();
  useThemeActions();
  return (
    <Animator>
      <Search />
      <RenderResults />
    </Animator>
  );
};
