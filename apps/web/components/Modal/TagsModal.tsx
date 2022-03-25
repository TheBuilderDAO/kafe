import { VscClose } from 'react-icons/vsc';
import Modal from 'react-modal';
import { useTheme } from 'next-themes';
import Tags from '@app/components/Tags/Tags';

Modal.setAppElement('#__next'); // This is for screen-readers. By binding the modal to the root element, screen-readers can read the content of the modal.

const TagsModal = ({ tags, modalIsOpen, closeModal }) => {
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

  const afterOpenModal = () => {
    console.log('hey');
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles}
      contentLabel="Support modal"
    >
      <h3 className="font-larken text-2xl text-center border-b-[0.5px] border-kafemellow mb-4 pt-5 pb-8">
        Tags
      </h3>
      <button
        className="absolute right-8 top-10 text-3xl "
        onClick={closeModal}
      >
        <VscClose />
      </button>
      <div className="px-10">
        <Tags tags={tags} overrideLengthCheck={true} />
      </div>
    </Modal>
  );
};

export default TagsModal;
