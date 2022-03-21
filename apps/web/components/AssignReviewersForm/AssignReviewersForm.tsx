import { useForm, Controller } from 'react-hook-form';

import { useCallback } from 'react';
import { useDapp } from '../../hooks/useDapp';
import { PublicKey } from '@solana/web3.js';
import {
  useReviewersAssign,
  useGetListOfReviewers,
} from '@builderdao-sdk/dao-program';
import { addEllipsis } from 'utils/strings';
import { Tutorial } from '@app/types/index';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import InputSelect from '../FormElements/InputSelect';
import Loader from '../Loader/Loader';

type AssignReviewersFormProps = {
  tutorial: Tutorial;
};

type FormData = {
  reviewer1: string;
  reviewer2: string;
};

const AssignReviewersForm = (props: AssignReviewersFormProps) => {
  const { tutorial } = props;
  const [reviewArray, setReviewArray] = useState([]);

  const { reviewers, loading, error } = useGetListOfReviewers();

  useEffect(() => {
    if (reviewers) {
      const sanitizedReviewArray = reviewers.map(
        reviewer =>
          `${addEllipsis(
            reviewer.account.pubkey.toString(),
          )} — ${reviewer.account.githubName.toString()}`,
      );

      setReviewArray(sanitizedReviewArray);
    }
  }, [reviewers]);
  const { handleSubmit, reset, control } = useForm<FormData>({
    defaultValues: {
      reviewer1: tutorial.reviewer1,
      reviewer2: tutorial.reviewer2,
    },
  });
  const { wallet } = useDapp();
  const [assignReviewers, { submitting }] = useReviewersAssign();
  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log('Data', data);
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
          loading: 'Assigning Reviewer',
          success: 'Reviewer assigned successfully',
          error: 'Error Assigning reviewer',
        });

        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [assignReviewers, tutorial, reset, wallet.publicKey],
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return error.message;
  }

  return (
    <form className="flex flex-col pt-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <label
          htmlFor="reviewer1"
          className="block text-sm font-medium text-kafeblack dark:text-kafewhite"
        >
          <span className="font-bold">Reviewer 1</span>
        </label>
        <div className="mt-1">
          <Controller
            name="reviewer1"
            rules={{ required: true }}
            control={control}
            render={({ field: { ref, onChange } }) => (
              <InputSelect
                inputRef={ref}
                onChange={onChange}
                options={reviewArray}
                placeholder="select reviewer 1"
                multiselect={false}
              />
            )}
          />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="reviewer2"
          className="block text-sm font-medium text-kafeblack dark:text-kafewhite"
        >
          <span className="font-bold">Reviewer 2</span>
        </label>
        <div>
          <Controller
            name="reviewer2"
            rules={{ required: true }}
            control={control}
            render={({ field: { ref, onChange } }) => (
              <InputSelect
                inputRef={ref}
                onChange={onChange}
                options={reviewArray}
                placeholder="select reviewer 2"
                multiselect={false}
              />
            )}
          />
        </div>
      </div>

      {wallet && (
        <button
          type="submit"
          disabled={submitting}
          className="items-center font-medium text-kafewhite dark:text-kafeblack bg-kafeblack dark:bg-kafewhite rounded-2xl h-12 shadow-sm hover:bg-kafegold dark:hover:text-kafered sm:text-sm"
        >
          {submitting ? 'submitting...' : 'submit'}
        </button>
      )}
    </form>
  );
};

export default AssignReviewersForm;
