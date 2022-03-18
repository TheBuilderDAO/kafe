import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProposeTutorialForm = dynamic(
  () => import('../../components/ProposeTutorialForm/ProposeTutorialForm'),
  {
    ssr: false,
  },
);

const WritePage = () => {
  return (
    <div>
      <Head>
        <title>Propose Tutorial</title>
      </Head>
      <main className="relative z-10 mt-20">
        <ProposeTutorialForm />
      </main>
    </div>
  );
};

export default WritePage;
