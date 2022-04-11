import React, { useCallback } from 'react';

import { useReviewerCreate } from '@builderdao/program-tutorial';
import { useDapp } from '../../hooks/useDapp';
import { useForm } from 'react-hook-form';
import { PublicKey } from '@solana/web3.js';
import toast, { Toaster } from 'react-hot-toast';

type AddReviewerFormProps = {};

type FormData = {
  reviewerPublicKey: string;
  githubName: string;
};

const AddReviewerForm = (props: AddReviewerFormProps) => {
  const { wallet } = useDapp();
  const [createReviewer, { submitting }] = useReviewerCreate();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const reviewerPk = new PublicKey(data.reviewerPublicKey);
        const tx = createReviewer({
          authorityPk: wallet.publicKey,
          reviewerPk: new PublicKey(data.reviewerPublicKey),
          githubName: data.githubName,
        });

        toast.promise(tx, {
          loading: 'Creating Reviewer',
          success: 'Reviewer added successfully',
          error: 'Error adding reviewer',
        });

        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [createReviewer, reset, wallet.publicKey],
  );

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <label
          htmlFor="reviewerPublicKey"
          className="block text-sm font-medium text-gray-700"
        >
          Reviewer Public Key
        </label>
        <div className="mt-1">
          <input
            type="text"
            className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...register('reviewerPublicKey', {
              required: true,
              maxLength: 100,
            })}
          />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="githubName"
          className="block text-sm font-medium text-gray-700"
        >
          Reviewer GitHub Username
        </label>
        <div className="mt-1">
          <input
            type="text"
            className="block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...register('githubName', {
              required: true,
              maxLength: 100,
            })}
          />
        </div>
      </div>

      {wallet && (
        <button
          type="submit"
          disabled={submitting}
          className="items-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          {submitting ? 'Submitting...' : 'Add reviewer'}
        </button>
      )}
    </form>
  );
};

export default AddReviewerForm;
