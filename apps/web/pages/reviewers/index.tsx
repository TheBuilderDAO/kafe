import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import ReviewersList from '@app/components/ReviewersList/ReviewersList';

const ReviewersPage: NextPage = () => (
  <>
    <Head>
      <title>Builder DAO - Reviewers</title>
    </Head>
    <main className="flex flex-col">
      <section className="w-full flex flex-row place-content-center gap-40">
        <div className="w-full bg-white shadow p-6 sm:rounded-lg">
          <ReviewersList />
        </div>
      </section>
    </main>
  </>
);

export default ReviewersPage;
