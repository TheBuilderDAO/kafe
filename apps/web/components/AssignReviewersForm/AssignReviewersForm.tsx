import { useForm } from 'react-hook-form';

import { useCallback } from 'react';
import { useDapp } from '../../hooks/useDapp';
import { PublicKey } from '@solana/web3.js';
import {
  useReviewersAssign,
  useGetListOfReviewers,
} from '@builderdao-sdk/dao-program';
import { addEllipsis } from 'utils/strings';
import { Tutorial } from '@app/types/index';
import toast from 'react-hot-toast';

type AssignReviewersFormProps = {
  tutorial: Tutorial;
};

type FormData = {
  reviewer1: string;
  reviewer2: string;
};

const AssignReviewersForm = (props: AssignReviewersFormProps) => {
  const { tutorial } = props;

  const { reviewers, reviewersMap, loading, error } = useGetListOfReviewers();
  const { register, handleSubmit, reset, getValues} = useForm<FormData>({
    defaultValues: {
      reviewer1: tutorial.reviewer1,
      reviewer2: tutorial.reviewer2
    },
  });
  const { wallet } = useDapp();
  const [assignReviewers, { submitting }] = useReviewersAssign();
  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const tx = assignReviewers({
          id: tutorial.id,
          authorityPk: wallet.publicKey,
          reviewerPks: [
            new PublicKey(data.reviewer1),
            new PublicKey(data.reviewer2),
          ],
        });

        await toast.promise(tx, {
          loading: "Assigning Reviewer",
          success: "Reviewer assigned successfully",
          error: "Error Assigning reviewer",
        })

        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [assignReviewers, tutorial, reset, wallet.publicKey],
  );

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return error.message;
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <label
          htmlFor="reviewer1"
          className="block text-sm font-medium text-gray-700"
        >
          Reviewer 1
        </label>
        <div className="mt-1">
          <select
            className="w-full mb-4 text-black border-b-2"
            {...register('reviewer1', { required: true })}
          >
            <option value="-1">Select reviewer...</option>
            {reviewers?.map(reviewer => {
              const pubKey = reviewer.account.pubkey.toString();
              const githubName = reviewer.account.githubName.toString();
              return (
                <option key={pubKey} value={pubKey}>
                  {addEllipsis(pubKey)} ({githubName})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="reviewer2"
          className="block text-sm font-medium text-gray-700"
        >
          Reviewer 2
        </label>
        <div className="mt-1">
          <select
            className="w-full mb-4 text-black border-b-2"
            {...register('reviewer2', { required: true })}
          >
            <option value="-1">Select reviewer...</option>
            {reviewers?.map(reviewer => {
              const pubKey = reviewer.account.pubkey.toString();
              const githubName = reviewer.account.githubName.toString();
              return (
                <option key={pubKey} value={pubKey}>
                  {addEllipsis(pubKey)} ({githubName})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {wallet && (
        <button
          type="submit"
          disabled={submitting}
          className="items-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </form>
  );
};

export default AssignReviewersForm;
