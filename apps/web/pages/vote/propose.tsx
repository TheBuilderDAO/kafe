import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import BorderSVG from '../../components/SVG/BorderSVG'

const ProposeTutorialForm = dynamic(
  () => import('../../components/ProposeTutorialForm/ProposeTutorialForm'),
  {
    ssr: false,
  },
);

const Propose: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Propose Tutorial</title>
      </Head>

      <main className="relative">
        <BorderSVG />
        <div className="p-10 text-black">
          <ProposeTutorialForm />
        </div>
      </main>
    </div>
  );
};

export default Propose;
