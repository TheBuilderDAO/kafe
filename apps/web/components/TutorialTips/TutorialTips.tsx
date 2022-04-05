import React, { useState } from 'react';
import { addEllipsis } from '../../utils/strings';
import VoteButton from '../VoteButton/VoteButton';
import { useGetListOfTippersById } from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import TipTutorialForm from '@app/components/TipTutorialForm/TipTutorialForm';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Loader from '@app/components/Loader/Loader';
import UserAvatar from '../UserAvatar/UserAvatar';
import Modal from 'react-modal';
import { useTheme } from 'next-themes';
import { VscClose } from 'react-icons/vsc';
import { useDapp } from '../../hooks/useDapp';

type TutorialTipsProps = {
  id: number;
};

Modal.setAppElement('#__next'); // This is for screen-readers. By binding the modal to the root element, screen-readers can read the content of the modal.

const TutorialTips = (props: TutorialTipsProps) => {
  const { id } = props;
  const { tippers, loading, error } = useGetListOfTippersById(id);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { theme } = useTheme();
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
      height: '400px',
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

  const SupportersModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Support modal"
      >
        <div className="sticky top-0 dark:bg-kafeblack bg-kafewhite">
          <h3 className="font-larken text-2xl text-center border-b-[0.5px] border-kafemellow mb-4 pt-5 pb-8">
            Supporters
          </h3>
          <button
            className="absolute text-3xl right-8 top-6 "
            onClick={closeModal}
          >
            <VscClose />
          </button>
        </div>
        <div className="overflow-auto">
          <ul className="px-8">
            {tippers.map((tipperAccount, index) => (
              <li
                className="flex items-center justify-between py-4 text-xs dark:text-kafewhite text-kafeblack"
                key={index}
              >
                <UserAvatar address={tipperAccount.account.pubkey.toString()} />
                <p className="font-space-italic">
                  {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL}{' '}
                  SOL
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="w-full text-kafeblack dark:text-kafewhite">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-larken">
          {tippers.length} {tippers.length !== 1 ? 'supporters' : 'supporter'}
        </h3>
        {tippers.length > 5 && (
          <small
            className="cursor-pointer hover:text-kafered dark:hover:text-kafegold"
            onClick={openModal}
          >
            view all
          </small>
        )}
        <SupportersModal />
      </div>
      <ul>
        {tippers.map((tipperAccount, index) => (
          <li
            className="flex items-center justify-between py-4 text-xs dark:text-kafewhite text-kafeblack"
            key={tipperAccount.account.pubkey.toString()}
          >
            <UserAvatar address={tipperAccount.account.pubkey.toString()} />
            <p className="font-space-italic">
              {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL} SOL
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <TipTutorialForm id={id} />
      </div>
    </div>
  );
};

export default TutorialTips;
