import React, { useCallback } from 'react';

import { useReviewerDelete } from '@builderdao-sdk/dao-program';
import { useDapp } from '../../hooks/useDapp';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';

type DeleteReviewerButtonProps = {
  reviewerPk: PublicKey;
};

const DeleteReviewerButton = (props: DeleteReviewerButtonProps) => {
  const { reviewerPk } = props;
  const { wallet } = useDapp();

  const [deleteReviewer, { submitting }] = useReviewerDelete();

  const handleClick = useCallback(async () => {
    try {
      const tx = deleteReviewer({
        reviewerPk,
        authorityPk: wallet.publicKey,
      });

      toast.promise(tx, {
        loading: "Deleting Reviewer",
        success: `Reviewer deleted successfully`,
        error: `Error deleting reviewer`,
      })
    } catch (err) {
      toast.error(err.message);
    }
  }, [deleteReviewer, reviewerPk, wallet.publicKey]);

  return (
    <button
      disabled={submitting}
      className="items-center w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
      onClick={handleClick}
    >
      {submitting ? 'Submitting...' : 'Delete'}
    </button>
  );
};

export default DeleteReviewerButton;
