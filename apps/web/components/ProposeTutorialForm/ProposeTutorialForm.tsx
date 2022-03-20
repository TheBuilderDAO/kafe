import { useForm, Controller } from 'react-hook-form';
import useTags from '../../hooks/useTags';
import { useCallback } from 'react';
import { useProposeTutorial } from '../../hooks/useProposeTutorial';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import toast from 'react-hot-toast';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import WriteForm from '../FormElements/WriteForm';
import WriteSidebar from '../Sidebars/WriteSidebar';
import WriteFormWrapper from '../Wrappers/WriteFormWrapper';
import LoginButton from '../LoginButton/LoginButton';
import { useRouter } from 'next/router';
import routes from '../../routes';
import { stringToSlug } from 'utils/strings';

type FormData = {
  title: string;
  description: string;
  difficulty: string;
  tags: { value: string; label: string }[];
};

const ProposeTutorialForm = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, watch, control } = useForm<FormData>();
  const { loading, error, tags } = useTags();

  const [proposeTutorial, { submitting }] = useProposeTutorial();

  const Placeholder = () => {
    return (
      <div className="w-full flex flex-col items-center text-center pt-20 justify-center font-larken lg:text-3xl text-2xl">
        <p className="pb-4">Connect your wallet to view this section.</p>
        <LoginButton />
      </div>
    );
  };

  const onSubmit = useCallback(
    async data => {
      try {
        data.slug = stringToSlug(data.title);
        data.tags = data.tags.map(tag => tag.value);

        const tx = proposeTutorial(data);

        await toast.promise(tx, {
          loading: `Proposing Tutorial`,
          success: `Tutorial ${data.title} proposed successfully`,
          error: `Error proposing tutorial`,
        });

        reset();

        router.push(routes.vote.proposal(data.slug));
      } catch (err) {
        toast.error(err.message);
      }
    },
    [proposeTutorial, reset, router],
  );

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return error.message;
  }

  return (
    <IsLoggedIn Placeholder={Placeholder}>
      <WriteFormWrapper handleSubmit={handleSubmit} onSubmit={onSubmit}>
        <WriteForm
          tags={tags}
          register={register}
          Controller={Controller}
          control={control}
          watch={watch}
        />
        <RightSidebar>
          <WriteSidebar submitting={submitting} />
        </RightSidebar>
      </WriteFormWrapper>
    </IsLoggedIn>
  );
};

export default ProposeTutorialForm;
