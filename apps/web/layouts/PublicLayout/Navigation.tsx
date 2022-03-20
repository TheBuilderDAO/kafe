import React from 'react';
import Link from 'next/link';
import routes from '../../routes';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';

export interface NavigateProps {
  $active: boolean;
}

const Navigation = () => {
  const router = useRouter();
  const StyledNavigate: React.FC<NavigateProps> = tw.a`
    ${props =>
      props.$active
        ? 'font-larken-italic dark:bg-kafedarker bg-kafelighter dark:text-kafewhite text-kafeblack p-2 rounded-3xl w-32'
        : ''}
    text-3xl
    font-larken
    leading-10
    block
    dark:hover:bg-kafedarker hover:bg-kafelighter dark:hover:text-kafewhite dark:text-kafewhite hover:text-kafeblack hover:text-kafewhite p-2 rounded-3xl w-32 px-5
  `;

  return (
    <>
      <div className="flex flex-row lg:flex-col flex-1 mt-5">
        <nav className="flex flex-1 justify-center lg:block space-y-1 space-x-2">
          <div>
            <Link key="learn" href={routes.learn.index} passHref>
              <StyledNavigate $active={router.pathname === routes.learn.index}>
                Learn
              </StyledNavigate>
            </Link>
          </div>
          <div>
            <Link key="vote" href={routes.vote.index} passHref>
              <StyledNavigate $active={router.pathname === routes.vote.index}>
                Vote
              </StyledNavigate>
            </Link>
          </div>
          <div>
            <Link key="write" href={routes.write.index} passHref>
              <StyledNavigate $active={router.pathname === routes.write.index}>
                Write
              </StyledNavigate>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
