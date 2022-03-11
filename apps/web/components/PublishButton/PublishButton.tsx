import React, { useCallback } from 'react';

import { usePublishTutorial } from '../../hooks/usePublishTutorial';

type PublishButtonProps = {
  id: number;
};

const PublishButton = (props: PublishButtonProps) => {
  const { id } = props;

  const [publishTutorial, { submitting }] = usePublishTutorial();

  const handleClick = useCallback(async () => {
    try {
      await publishTutorial(id);

      alert('Tutorial published successfully');
    } catch (err) {
      alert('Something went wrong');
    }
  }, [id, publishTutorial]);

  return (
    <button
      disabled={submitting}
      className="items-center w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
      onClick={handleClick}
    >
      {submitting ? 'Submitting...' : 'Publish'}
    </button>
  );
};

export default PublishButton;
