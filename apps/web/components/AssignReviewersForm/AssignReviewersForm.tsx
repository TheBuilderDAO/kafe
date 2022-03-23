import { useForm, Controller } from 'react-hook-form';
import { components, ControlProps } from 'react-select';
import { useCallback } from 'react';
import { useDapp } from '../../hooks/useDapp';
import { PublicKey } from '@solana/web3.js';
import {
  useReviewersAssign,
  useGetListOfReviewers,
} from '@builderdao-sdk/dao-program';
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
  const [reviewArray, setReviewArray] = useState([]);

  const Control = ({ children, ...props }: ControlProps) => (
    <components.Control {...props}> {children}</components.Control>
  );

  const { reviewers, loading, error } = useGetListOfReviewers();

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
  }, [reviewers]);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const { wallet } = useDapp();
  const [assignReviewers, { submitting }] = useReviewersAssign();

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
      <small className="mt-4 mb-2">Reviewers</small>
      <Controller
        name="reviewer1"
        rules={{ required: true }}
        render={({ field: { ref, onChange } }) => (
          <InputSelectOne
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
        render={({ field: { ref, onChange } }) => (
          <InputSelectOne
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
      <div className="border-t-[0.5px] border-kafeblack dark:border-kafemellow break-all pt-4 pb-4 mt-10">
        <p>
          Create guide at:
          <span className="text-kafemellow">
            https://github.com/clalancette/98898903ije093heibe23y36
          </span>
        </p>
      </div>
    </form>
  );
};

export default AssignReviewersForm;
