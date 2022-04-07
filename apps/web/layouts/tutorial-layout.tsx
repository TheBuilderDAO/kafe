import { Link, MDXWrapper, PageTitle, SectionContainer } from '@builderdao/ui';
// import { BlogSEO } from '@/components/SEO' // TODO: Add json:schema for this
import React, { ReactNode } from 'react';
import TableOfContent from '@app/components/TableOfContent';
import { useRouter } from 'next/router';
import { TutorialFrontMatter } from '@builderdao/md-utils';
import RightSidebar from './PublicLayout/RightSidebar';
import Tags from '@app/components/Tags/Tags';
import TutorialTips from '@app/components/TutorialTips/TutorialTips';
import { BuilderDaoConfigJson } from '@builderdao/cli';
import _ from 'lodash';
import { formatDate } from '@app/lib/utils/format-date';
import UserAvatar from '../components/UserAvatar/UserAvatar';

interface Props {
  tutorialId: number;
  frontMatter: TutorialFrontMatter;
  children: ReactNode;
  config: BuilderDaoConfigJson;
  toc: {
    id: string;
    title: string;
    href: string;
    depth: number;
  }[];
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
}

export const TutorialLayout: React.FC<Props> = ({
  tutorialId,
  frontMatter,
  next,
  prev,
  config,
  toc,
  children,
}) => {
  const { query } = useRouter();
  const { slug, date, title, description, keywords } = frontMatter;
  const path = `/learn/${query.slug[0]}`;

  return (
    <div className="flex justify-between">
      <SectionContainer>
        {/* <BlogSEO url={`${siteMetadata.siteUrl}/blog/${slug}`} {...frontMatter} /> */}
        <article className="z-50 inline-flex mt-8 border dark:bg-kafeblack bg-kafewhite border-1 border-kafeblack dark:border-kafewhite">
          <div className="px-7 py-4">
            <header>
              <div className="pb-5 space-y-1 text-center">
                {/* The below snippet of code will be uncommented out when we have the author and reviewer info as part of props */}
                {/* <dl>
                  <div className="flex justify-between text-xs">
                    <div className="flex space-x-1 items-center">
                      <p>Guide by</p>
                      <UserAvatar address={'eskimo.sol'} ellipsis={false} />
                      <div>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-xs font-medium leading-6 ml-4">
                          <time dateTime={date}>{formatDate(date)}</time>
                        </dd>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <p>Reviewed by</p>
                      <UserAvatar address={'dustin54.sol'} ellipsis={false} />
                      <UserAvatar address={'hsdragon.sol'} ellipsis={false} />
                    </div>
                  </div>
                </dl> */}
                <div className="font-larken pt-12">
                  <PageTitle>{title}</PageTitle>
                </div>
                <p className="pt-4 pb-2 font-thin text-left">{description}</p>
                <div className="text-left">
                  <Tags
                    tags={_.uniq([...config.categories, ...keywords])}
                    overrideLengthCheck={true}
                  />
                </div>
              </div>
            </header>
            <div
              className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 "
              style={{ gridTemplateRows: 'auto 1fr' }}
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0">
                <div className="pt-10 pb-8 mx-auto text-base leading-8 prose-sm prose break-words dark:prose-invert prose-a:font-larken prose-a:no-underline prose:a-text-kafeblack dark:prose-a:text-kafewhite prose-a:text-lg hover:prose-a:underline prose-code:p-1 dark:prose-code:bg-kafedarker prose-code:bg-kafemellow prose-code:rounded prose-code:b text-kafedark dark:text-kafewhite prose-td:break-all first:prose-td:break-normal prose-td:border prose-td:border-kafemellow prose-td:p-1">
                  {children}
                </div>
              </div>
              {/*<Comments frontMatter={frontMatter} />*/}
              <footer className="bg-">
                <div className="flex flex-row justify-between text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                  {prev && (
                    <div className="pt-4 xl:pt-8">
                      <Link
                        href={`${path}${prev.slug}`}
                        className="text-kafewhite dark:text-kafewhite hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        &larr; {prev.title}
                      </Link>
                    </div>
                  )}
                  {next && (
                    <div className="pt-4 xl:pt-8">
                      <Link
                        href={`${path}${next.slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {next.title} &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </footer>
            </div>
          </div>
        </article>
      </SectionContainer>
      <div className="sticky">
        <RightSidebar>
          <div className="p-6">
            <TutorialTips id={tutorialId} />
          </div>
          <TableOfContent toc={toc} />
        </RightSidebar>
      </div>
    </div>
  );
};
