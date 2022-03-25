import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import Eyecon from 'public/assets/icons/eyes.svg';
import Image from 'next/image';
import AssignReviewersForm from '../AssignReviewersForm/AssignReviewersForm';
import { ProposalStateE, useIsAdmin } from '@builderdao-sdk/dao-program';
import { ZERO_ADDRESS } from '@app/constants';
import { useDapp } from '../../hooks/useDapp';
import { useMemo } from 'react';

const WriteOnGitHub = ({ tutorial, RenderReviewer }) => {
  const { wallet } = useDapp();
  const { isAdmin, loading, error } = useIsAdmin();

  const userType = useMemo(() => {
    if (wallet.publicKey.toString() === tutorial.creator) {
      return 'author';
    } else if (isAdmin) {
      return 'admin';
    }
    return null;
  }, [tutorial, wallet.publicKey, isAdmin]);

  if (loading || error || !userType) {
    return null;
  }

  return (
    <div className="mt-6">
      <RightSidebar>
        <div className="p-6">
          {tutorial.state !== ProposalStateE.readyToPublish &&
            tutorial.state !== ProposalStateE.published && (
              <div>
                <section className="flex justify-between mb-6">
                  <h3 className="text-2xl font-larken">Write on Github</h3>
                  <span className="flex items-center">
                    <Image src={Eyecon} width={18} height={18} alt="icon" />
                    <small className="pl-2">{userType}</small>
                  </span>
                </section>
                {tutorial.reviewer1 !== ZERO_ADDRESS && (
                  <RenderReviewer pubkey={tutorial.reviewer1} number="1" />
                )}
                {tutorial.reviewer2 !== ZERO_ADDRESS && (
                  <RenderReviewer pubkey={tutorial.reviewer2} number="2" />
                )}
                {tutorial.reviewer1 === ZERO_ADDRESS &&
                  tutorial.reviewer2 === ZERO_ADDRESS && (
                    <p>No reviewers assigned yet</p>
                  )}
                {userType === 'admin' && (
                  <AssignReviewersForm tutorial={tutorial} />
                )}
                <div className="border-t-[0.5px] border-kafeblack dark:border-kafemellow break-all pt-4 pb-4 mt-10">
                  <p>
                    Create guide at:{' '}
                    <span className="text-kafemellow">
                      https://github.com/clalancette/98898903ije093heibe23y36
                    </span>
                  </p>
                </div>
              </div>
            )}
        </div>
      </RightSidebar>
    </div>
  );
};

export default WriteOnGitHub;
