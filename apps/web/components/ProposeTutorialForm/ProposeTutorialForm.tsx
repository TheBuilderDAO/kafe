import { useForm } from 'react-hook-form';
import InputTitle from '../FormElements/InputTitle';
import InputTextArea from '../FormElements/InputTextArea';
import InputSelect from '../FormElements/InputSelect';
import useTags from '../../hooks/useTags';
import { useDapp } from '../../hooks/useDapp';
import { useCallback } from 'react';
import { useProposeTutorial } from '../../hooks/useProposeTutorial';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import toast from 'react-hot-toast';
import InputCheckbox from '../FormElements/InputCheckbox';
import BorderSVG from '../../components/SVG/BorderSVG';
import KafePassSVG from '../../components/SVG/KafePassSVG';
import Image from 'next/image';
import defaultAvatar from '/public/assets/icons/default_avatar.svg';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';

type FormData = {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  tags: string[];
};

const ProposeTutorialForm = () => {
  const { wallet } = useDapp();
  const walletIcon = wallet?.wallet?.adapter?.icon; //TO-DO: figure out better way to create user icons
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
      <form
        className="flex justify-between text-kafeblack dark:text-kafewhite -mt-[10px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative min-w-[700px] grow">
          <BorderSVG />
          <div className="p-10">
            <div className="mb-5">
              <div className="text-sm flex items-center">
                <p>Proposal by{'  '}</p>
                <div className="mx-2">
                  <Image
                    src={walletIcon ? walletIcon : defaultAvatar}
                    alt="wallet icon"
                    width="25"
                    height="25"
                  />
                </div>
                <p className="font-black">{wallet.wallet.adapter.name}</p>
              </div>
              <div className="mt-1">
                <InputTitle
                  placeholder="Enter a title"
                  {...register('title', {
                    required: true,
                    maxLength: 100,
                  })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-14">
              <div className="flex-1 mr-20">
                <label
                  htmlFor="tags"
                  className="block text-kafeblack dark:text-kafewhite text-sm"
                >
                  Enter tags
                </label>
                <div>
                  <InputSelect
                    options={tags}
                    {...register('tags', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium pb-2"
                >
                  Difficulty level
                </label>
                <div>
                  <InputCheckbox
                    options={['Beginner', 'Intermediate', 'Advanced']}
                    {...register('difficulty', { required: true })}
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="comment" className="block text-sm">
                Summary
              </label>
              <div className="mt-1">
                <InputTextArea maxLength={480} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <RightSidebar>
            <>
              <p className="font-larken text-xl pb-2">Kafé token</p>
              <p>
                You&apos;ll need 1 Kafé token to submit a proposal.{' '}
                <a href="#">Learn more</a>
              </p>
              <div className="flex justify-center py-4">
                <KafePassSVG />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="items-center px-6 py-4 w-full font-medium dark:text-kafeblack text-kafewhite bg-kafeblack dark:bg-kafegold border border-transparent rounded-3xl shadow-sm hover:bg-kafepurple dark:hover:bg-kafered sm:text-sm"
              >
                {submitting ? 'Submitting...' : 'submit proposal'}
              </button>
            </>
          </RightSidebar>
        </div>
      </form>
    </IsLoggedIn>
  );
};

export default ProposeTutorialForm;
