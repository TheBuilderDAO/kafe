import React from 'react';
import { addEllipsis } from '../../utils/strings';
import { useDapp } from '../../hooks/useDapp';
import { useGetListOfReviewers } from '@builderdao/use-program-tutorial';
import AddReviewerForm from '@app/components/AddReviewerForm/AddReviewerForm';
import DeleteReviewerButton from '@app/components/DeleteReviewerButton/DeleteReviewerButton';
import IsAdmin from '@app/components/IsAdmin/IsAdmin';
import Loader from '@app/components/Loader/Loader';

type ReviewersListProps = {};

const ReviewersList = (props: ReviewersListProps) => {
  const { wallet } = useDapp();

  const { reviewers, loading, error, mutate } = useGetListOfReviewers();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <div>Error occurred</div>
        <button onClick={() => mutate()}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="text-black">
      <h3 className="text-xl">
        Reviewers <small>{reviewers.length}</small>
      </h3>
      <ul>
        {reviewers.map((reviewer, index) => (
          <li className="py-4" key={reviewer.account.pubkey.toString()}>
            <div className="flex flex-row content-center justify-between">
              <div>
                <div>
                  {index + 1}. {addEllipsis(reviewer.account.pubkey.toString())}{' '}
                  ({reviewer.account.githubName.toString()})
                </div>
                <div>Assignments: {reviewer.account.numberOfAssignment}</div>
              </div>
              <div>
                {reviewer.account.numberOfAssignment == 0 && (
                  <IsAdmin>
                    <DeleteReviewerButton
                      reviewerPk={reviewer.account.pubkey}
                    />
                  </IsAdmin>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <IsAdmin>
        {wallet.connected && (
          <>
            <hr />
            <div className="mt-6">
              <h3 className="mb-3 text-xl">New reviewer</h3>
              <AddReviewerForm />
            </div>
          </>
        )}
      </IsAdmin>
    </div>
  );
};

export default ReviewersList;
