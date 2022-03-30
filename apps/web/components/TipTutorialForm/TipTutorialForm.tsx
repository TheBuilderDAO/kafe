import { useForm } from 'react-hook-form';
import React, { useCallback, useState } from 'react';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import toast from 'react-hot-toast';
import { Notifications } from '@app/components/Notifications/Notifications';
import LoginButton from '../LoginButton/LoginButton';
import InputTitle from '@app/components/FormElements/InputTitle';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useDapp } from '../../hooks/useDapp';
import { useTipTutorial } from '../../hooks/useTipTutorial';
import Modal from 'react-modal';
import { useTheme } from 'next-themes';
import { VscClose } from 'react-icons/vsc';
import AccountBalance from '@app/components/AccountBalance/AccountBalance';

type FormData = {
  amount: number;
};

type TipTutorialProps = {
  id: number;
};

Modal.setAppElement('#__next'); // This is for screen-readers. By binding the modal to the root element, screen-readers can read the content of the modal.

const TipTutorialForm = (props: TipTutorialProps) => {
  const { id } = props;
  const { wallet } = useDapp();
  const { register, handleSubmit, reset, watch, control } = useForm<FormData>();
  const { theme } = useTheme();

  const [tipTutorial, { submitting }] = useTipTutorial();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dark = theme === 'dark';

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      borderRadius: '40px',
      minHeight: '460px',
      padding: '20px 0 20px 0',
      background: dark ? '#1E1C1E' : '#EAE4D9',
    },
    overlay: {
      zIndex: 1000,
    },
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const KafeModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Support modal"
      >
        <form
          className="dark:text-white text-black font-mono"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="font-larken text-2xl text-center border-b-[0.5px] border-kafemellow mb-4 pt-5 pb-8">
            Support Project
          </h3>
          <button
            className="absolute right-8 top-10 text-3xl "
            onClick={closeModal}
          >
            <VscClose />
          </button>
          <section className="px-10">
            <div className="flex items-center my-10">
              <span className="text-sm mr-4 text-[#737373]">Balance:</span>
              <span>
                <AccountBalance />
              </span>
            </div>
            <input
              {...register('amount', {
                required: true,
                maxLength: 100,
              })}
              type="number"
              id="number"
              min="0"
              step="0.000001"
              placeholder="Amount in SOL"
              className="w-full dark:bg-kafedarker bg-kafelighter rounded-2xl h-14 px-4 text-kafeblack dark:text-kafewhite ring-kafeblack dark:ring-kafewhite"
            />
            <p className="text-[#737373] text-xs leading-4 mt-4">
              Your support will be distributed amongst the creator and reviewers
              of this guide
            </p>
            <button className="w-full text-sm h-16 rounded-3xl mt-10 dark:bg-kafewhite bg-kafeblack hover:bg-kafelighter dark:hover:bg-kafedarker text-kafelighter dark:text-kafeblack hover:text-kafeblack dark:hover:text-kafewhite">
              support
            </button>
          </section>
        </form>
      </Modal>
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
        closeModal();
        reset();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [id, reset, tipTutorial, wallet.publicKey],
  );

  return (
    <form onSubmit={e => e.preventDefault()}>
      <button
        type="submit"
        onClick={openModal}
        disabled={submitting || !wallet.connected}
        className="disabled:opacity-25 items-center px-6 py-4 w-full font-medium dark:text-kafeblack text-kafewhite bg-kafeblack dark:bg-kafewhite border border-transparent rounded-2xl shadow-sm hover:bg-kafewhite hover:border-kafeblack dark:hover:bg-kafeblack dark:hover:text-kafewhite sm:text-sm hover:text-kafeblack dark:hover:border-kafewhite"
      >
        {submitting ? 'Submitting...' : 'support'}
      </button>
      <KafeModal />
      <Notifications />
    </form>
  );
};

export default TipTutorialForm;
