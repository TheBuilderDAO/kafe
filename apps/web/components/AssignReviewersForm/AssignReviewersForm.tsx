import { useForm, Controller } from 'react-hook-form';
import { components, ControlProps } from 'react-select';
import { useCallback, useMemo } from 'react';
import { useDapp } from '../../hooks/useDapp';
import { PublicKey } from '@solana/web3.js';
import {
  useReviewersAssign,
  useGetListOfReviewers,
} from '@builderdao/use-program-tutorial';
import { Tutorial } from '@app/types/index';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import InputSelectOne from '../FormElements/InputSelectOne';
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
  const { wallet } = useDapp();
  const { reviewers, loading, error } = useGetListOfReviewers();
  const [assignReviewers, { submitting }] = useReviewersAssign();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [reviewArray, setReviewArray] = useState([]);

  useEffect(() => {
    if (reviewers) {
      const sanitizedReviewArray = [];
      reviewers.forEach(reviewer => {
        if (reviewer.account.pubkey.toString() != tutorial.creator) {
          sanitizedReviewArray.push({
            value: `${reviewer.account.pubkey.toString()}`,
            label: `${reviewer.account.githubName.toString()}`,
          });
        }
      });

      setReviewArray(sanitizedReviewArray);
    }
  }, [reviewers, tutorial.creator]);

  useEffect(() => {
    if (reviewArray.length) {
      const reviewer1Value = reviewArray.find(
        review => review.value === tutorial.reviewer1.toString(),
      );
      if (reviewer1Value) {
        setValue('reviewer1', reviewer1Value);
      }
    }

    if (reviewArray.length) {
      const reviewer2Value = reviewArray.find(
        review => review.value === tutorial.reviewer2.toString(),
      );
      if (reviewer2Value) {
        setValue('reviewer2', reviewer2Value);
      }
    }
  }, [tutorial, reviewArray, setValue]);

  const onError = () => {
    toast.error('Please fill out all form fields');
  };

  const onSubmit = useCallback(
    async data => {
      data = {
        reviewer1: data.reviewer1.value,
        reviewer2: data.reviewer2.value,
      };
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
    <form
      className="flex flex-col pt-2"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Controller
        name="reviewer1"
        rules={{ required: true }}
        render={({ field: { ref, value, onChange } }) => (
          <InputSelectOne
            value={value}
            items={reviewArray}
            inputRef={ref}
            onChange={onChange}
          />
        )}
        control={control}
      />
      <Controller
        name="reviewer2"
        rules={{ required: true }}
        render={({ field: { ref, value, onChange } }) => (
          <InputSelectOne
            value={value}
            items={reviewArray}
            inputRef={ref}
            onChange={onChange}
          />
        )}
        control={control}
      />
      {wallet && (
        <button
          type="submit"
          disabled={submitting}
          className="items-center mt-6 font-medium text-kafewhite dark:text-kafeblack bg-kafeblack dark:bg-kafewhite rounded-2xl h-12 shadow-sm hover:bg-kafegold dark:hover:text-kafered sm:text-sm"
        >
          {submitting ? 'assigning reviewers...' : 'assign reviewers'}
        </button>
      )}
    </form>
  );
};

export default AssignReviewersForm;
