import { useForm, Controller } from 'react-hook-form';
import useTags from '../../hooks/useTags';
import { useCallback, useEffect } from 'react';
import { useProposeTutorial } from '../../hooks/useProposeTutorial';
import toast from 'react-hot-toast';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import WriteForm from '../FormElements/WriteForm';
import WriteSidebar from '../Sidebars/WriteSidebar';
import WriteFormWrapper from '../Wrappers/WriteFormWrapper';
import { useRouter } from 'next/router';
import routes from '../../routes';
import { stringToSlug } from 'utils/strings';
import Loader from '../Loader/Loader';
import { useDapp } from '../../hooks/useDapp';
import { Balance } from '../Sidebars/Balance';
import { useBalance } from 'hooks/useBalance';

type FormData = {
  title: string;
  description: string;
  difficulty: string;
  tags: { value: string; label: string }[];
};

const ProposeTutorialForm = () => {
  const router = useRouter();
  const { wallet } = useDapp();
  const { balance } = useBalance();
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
        if (balance.sol_balance < 0.00001) {
          toast.error('Not enough Sol');
          return;
        }
        if (balance.kafe_balance < 1) {
          toast.error('Not enough Kafe Token');
          return;
        }
        data.slug = stringToSlug(data.title);
        data.tags = data.tags.map(tag => tag.value);

        const tx = proposeTutorial(data);

        await toast.promise(tx, {
          loading: `Proposing Tutorial`,
          success: `Tutorial ${data.title} proposed successfully`,
          error: error => {
            return error?.message || `Error proposing tutorial`;
          },
        });

        reset();

        router.push(routes.vote.proposal(data.slug));
      } catch (err) {
        // Do nothing toast.promise already prints error
      }
    },
    [proposeTutorial, reset, router],
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
        <Balance />
      </RightSidebar>
    </WriteFormWrapper>
  );
};

export default ProposeTutorialForm;
