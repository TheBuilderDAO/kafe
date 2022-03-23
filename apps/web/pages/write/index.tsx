import Head from 'next/head';
import ProposeTutorialForm from '../../components/ProposeTutorialForm/ProposeTutorialForm';

const WritePage = () => {
  return (
    <div>
      <Head>
        <title>Propose Tutorial</title>
      </Head>
      <main className="relative z-10 w-full">
        <ProposeTutorialForm />
      </main>
    </div>
  );
};

export default WritePage;
