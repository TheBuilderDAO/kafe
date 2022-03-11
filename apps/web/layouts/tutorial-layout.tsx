import { Link, MDXWrapper, PageTitle, SectionContainer } from '@builderdao/ui';
// import { BlogSEO } from '@/components/SEO' // TODO: Add json:schema for this
import React, { ReactNode } from 'react';
import TableOfContent from '@app/components/TableOfContent';
import { formatDate } from '@app/lib/utils/format-date';
import { useRouter } from 'next/router';
import { TutorialFrontMatter } from '@builderdao/md-utils';

interface Props {
  frontMatter: TutorialFrontMatter;
  children: ReactNode;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
}

export const TutorialLayout: React.FC<Props> = ({
  frontMatter,
  next,
  prev,
  children,
}) => {
  const { query } = useRouter();
  const { slug, date, title } = frontMatter;
  const [resized, setResized] = React.useState<boolean>(false);

  const resizePane = () => {
    setResized(!resized);
  };

  const [ids, setIds] = React.useState<Array<{ id: string; title: string }>>(
    [],
  );

  React.useEffect(() => {
    /**
     * Working around some race condition quirks :) (don't judge)
     * TODO @Necmttn: see if there's a better way through a remark plugin to do this
     */
    setTimeout(() => {
      const titles = document.querySelectorAll('h2');
      const idArrays = Array.prototype.slice
        .call(titles)
        .map(title => ({ id: title.id, title: title.innerText })) as Array<{
        id: string;
        title: string;
      }>;
      setIds(idArrays);
    }, 500);
  }, [slug]);
  const path = `/learn/${query.slug[0]}`;
  const postUrl = `https://paircode.dev${path}`;
  return (
    <div>
      <SectionContainer>
        {/* <BlogSEO url={`${siteMetadata.siteUrl}/blog/${slug}`} {...frontMatter} /> */}
        <TableOfContent ids={ids} />
        <article
          className={`h-entry border-kafeblack dark:border-kafewhite border-2 ${
            resized ? 'animate-slide-up' : 'animate-slide-down'
          } z-10 bg-kafewhite dark:bg-kafeblack`}
        >
          <div
            className={`m-0 flex flex-row-reverse p-4 pr-6 text-2xl ${
              resized ? 'hover:text-kafered' : 'hover:text-kafepurple'
            } cursor-pointer`}
            onClick={resizePane}
          >
            {resized ? '↓' : '↑'}
          </div>
          <div className="p-6">
            <header>
              <div className="pb-10 space-y-1 text-center border-b border-gray-200 dark:border-gray-700">
                <dl>
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </div>
                </dl>
                <div className="font-larken">
                  <PageTitle>{title}</PageTitle>
                </div>
              </div>
            </header>
            <div
              className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 "
              style={{ gridTemplateRows: 'auto 1fr' }}
            >
              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2 ">
                <div className="max-w-3xl px-4 pt-10 pb-8 mx-auto prose prose-lg dark:prose-dark">
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
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
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
        <div>
          <div className="text-center">TODO: Supporters TODO: Authors</div>
        </div>
      </SectionContainer>
    </div>
  );
};
