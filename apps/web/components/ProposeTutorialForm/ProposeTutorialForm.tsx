import { useForm } from 'react-hook-form';
import useTags from '../../hooks/useTags';
import { useCallback } from 'react';
import { useProposeTutorial } from '../../hooks/useProposeTutorial';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import toast from 'react-hot-toast';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import WriteForm from '../FormElements/WriteForm';
import WriteSidebar from '../Sidebars/WriteSidebar';
import WriteFormWrapper from '../Wrappers/WriteFormWrapper';

type FormData = {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  tags: string[];
};

const ProposeTutorialForm = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { loading, error, tags } = useTags();

  const [proposeTutorial, { submitting }] = useProposeTutorial();

  const onSubmit = useCallback(
    async data => {
      try {
        const tx = proposeTutorial(data);
        toast.promise(tx, {
          loading: `Proposing Tutorial`,
          success: `Tutorial ${data.title} proposed successfully`,
          error: `Error proposing tutorial`,
        });
        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [proposeTutorial, reset],
  );

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return error.message;
  }

  return (
    <IsLoggedIn>
      <WriteFormWrapper handleSubmit={handleSubmit} onSubmit={onSubmit}>
        <WriteForm tags={tags} register={register} />
        <RightSidebar>
          <WriteSidebar submitting={submitting} />
        </RightSidebar>
      </WriteFormWrapper>
    </IsLoggedIn>
  );
};

export default ProposeTutorialForm;
