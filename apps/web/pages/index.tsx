import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import TutorialProposalHit from '@app/components/Search/TutorialProposalHit';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import Link from 'next/link';
import routes from 'routes';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import Loader from '@app/components/Loader/Loader';

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
);

const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Builder DAO</title>
      </Head>
      <Loader message="Work in Progress" />
    </>
  );
};

export default LandingPage;
