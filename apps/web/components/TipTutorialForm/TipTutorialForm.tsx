import { useForm } from 'react-hook-form';
import React, { useCallback } from 'react';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import toast from 'react-hot-toast';
import LoginButton from '../LoginButton/LoginButton';
import InputTitle from '@app/components/FormElements/InputTitle';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useDapp } from '../../hooks/useDapp';
import { useTipTutorial } from '../../hooks/useTipTutorial';
import AccountBalance from '@app/components/AccountBalance/AccountBalance';

type FormData = {
  amount: number;
};

type TipTutorialProps = {
  id: number;
};

const TipTutorialForm = (props: TipTutorialProps) => {
  const { id } = props;
  const { wallet } = useDapp();
  const { register, handleSubmit, reset, watch, control } = useForm<FormData>();

  const [tipTutorial, { submitting }] = useTipTutorial();

  const Placeholder = () => {
    return (
      <div className="w-full flex flex-col items-center min-h-[200px] justify-center font-larken text-3xl -ml-12">
        <p className="pb-4">Connect your wallet to view this section.</p>
        <LoginButton />
      </div>
    );
  };

  const onSubmit = useCallback(
    async data => {
      try {
        const amount = data.amount * LAMPORTS_PER_SOL;
        const tx = tipTutorial({
          id,
          tipperPk: wallet.publicKey,
          amount,
        });

        await toast.promise(tx, {
          loading: `Supporting Tutorial`,
          success: `Your support has been received`,
          error: `Error showing your support`,
        });

        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [id, reset, tipTutorial, wallet.publicKey],
  );

  return (
    <IsLoggedIn Placeholder={Placeholder}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          Balance: <AccountBalance />
        </div>
        <input
          {...register('amount', {
            required: true,
            maxLength: 100,
          })}
          className="p-0 pt-2 mb-16  focus:ring-0 font-larken text-2xl block w-full dark:bg-kafeblack bg-kafewhite border-none rounded-md text-kafeblack dark:text-kafewhite placeholder:text-[#474443]"
          type="text"
          placeholder="Amount (SOL)"
        />

        <button
          type="submit"
          disabled={submitting}
          className="items-center px-6 py-4 w-full font-medium dark:text-kafeblack text-kafewhite bg-kafeblack dark:bg-kafegold border border-transparent rounded-3xl shadow-sm hover:bg-kafepurple dark:hover:bg-kafered sm:text-sm"
        >
          {submitting ? 'Submitting...' : 'support'}
        </button>
      </form>
    </IsLoggedIn>
  );
};

export default TipTutorialForm;
