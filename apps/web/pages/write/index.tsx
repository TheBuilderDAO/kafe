import Head from 'next/head';
import ProposeTutorialForm from '../../components/ProposeTutorialForm/ProposeTutorialForm';

const WritePage = () => {
  return (
    <div>
      <Head>
        <title>Kafé by Builder DAO - Propose a Guide</title>
      </Head>
      <main className="relative w-full">
        <ProposeTutorialForm />
      </main>
    </div>
  );
};

export default WritePage;
