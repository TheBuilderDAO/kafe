import IsAdmin from '@app/components/IsAdmin/IsAdmin';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import Eyecon from 'public/assets/icons/eyes.svg';
import Image from 'next/image';
import AssignReviewersForm from '../AssignReviewersForm/AssignReviewersForm';

const WriteOnGitHub = ({
  tutorial,
  ProposalStateE,
  ZERO_ADDRESS,
  RenderReviewer,
}) => {
  return (
    <IsAdmin>
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
                      <small className="pl-2">admin</small>
                    </span>
                  </section>
                  {tutorial.reviewer1 !== ZERO_ADDRESS && (
                    <RenderReviewer pubkey={tutorial.reviewer1} number="1" />
                  )}
                  {tutorial.reviewer2 !== ZERO_ADDRESS && (
                    <RenderReviewer pubkey={tutorial.reviewer2} number="2" />
                  )}
                  <AssignReviewersForm tutorial={tutorial} />
                </div>
              )}
          </div>
        </RightSidebar>
      </div>
    </IsAdmin>
  );
};

export default WriteOnGitHub;
