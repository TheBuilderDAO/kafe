import { useForm, Controller } from 'react-hook-form';
import useTags from '../../hooks/useTags';
import { useCallback, useEffect } from 'react';
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
import Loader from '../Loader/Loader';
import { useDapp } from '../../hooks/useDapp';

type FormData = {
  title: string;
  description: string;
  difficulty: string;
  tags: { value: string; label: string }[];
};

const ProposeTutorialForm = () => {
  const router = useRouter();
  const { wallet } = useDapp();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const { loading, error, tags } = useTags();

  const [proposeTutorial, { submitting }] = useProposeTutorial();

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
    [proposeTutorial, reset, router, wallet.connected],
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return error.message;
  }

  return (
    <WriteFormWrapper
      key="proposal-form"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    >
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
  );
};

export default ProposeTutorialForm;
