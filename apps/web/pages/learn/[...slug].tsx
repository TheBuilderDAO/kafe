import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import _ from 'lodash';
import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';
import { addEllipsis } from 'utils/strings';
import path from 'path';
import {
  getFileByPath,
  getFileParse,
  getPathForFile,
  getPathForRootFolder,
  getTutorialContentByPackageName,
  getTutorialContentByPath,
  getTutorialPaths,
  PostType,
} from '@builderdao/md-utils';
import { getMDXComponents, MDXComponents } from '@builderdao/ui';
import React from 'react';
import { TutorialLayout } from 'layouts/tutorial-layout';
import { serializeContent } from '@app/lib/md/serializeContent';
import { ArweaveApi } from '@builderdao/apis';
import {
  NEXT_PUBLIC_ARWEAVE_APP_NAME,
  NEXT_PUBLIC_ARWEAVE_HOST,
  NEXT_PUBLIC_ARWEAVE_PORT,
  NEXT_PUBLIC_ARWEAVE_PROTOCOL,
  NODE_ENV,
} from '@app/constants';
import { getFileFromGithub, getGithubUrl } from '@app/lib/api/github';

const getFile = (slug, pathForFile) => {
  if (NODE_ENV === 'production') {
    return `/api/github/${slug}/${pathForFile}`;
  } else {
    return path.join('/tutorials/', slug, pathForFile);
  }
};

const TutorialPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  const { mdxSource, frontMatter } = props.post;
  const { config, lock, relativePath, rootFolder } = props;
  const anchors = React.Children.toArray(mdxSource.compiledSource)
    .filter(
      (child: any) =>
        child.props?.mdxType && ['h2', 'h3'].includes(child.props.mdxType),
    )
    .map((child: any) => ({
      url: '#' + child.props.id,
      depth:
        (child.props?.mdxType &&
          parseInt(child.props.mdxType.replace('h', ''), 0)) ??
        0,
      text: child.props.children,
    }));
  return (
    <>
      <Head>
        <title>Kafé by Builder DAO - {config.title}</title>
      </Head>
      <TutorialLayout
        tutorialId={lock.proposalId}
        frontMatter={frontMatter}
        config={config}
        next={frontMatter.next}
        prev={frontMatter.prev}
      >
        <MDXRemote
          components={getMDXComponents({ lock, rootFolder, getFile })}
          {...mdxSource}
          scope={{ config, lock }}
        />
        <div className="p-2 mt-16 border border-black divide-y-[1px] divide-gray-600 rounded-lg dark:border-white dark:text-kafewhite bg-kafegold dark:bg-kafedarker shadow:sm">
          <div className="p-2">
            <span>Digest</span>:{' '}
            <span className="font-mono text-sm">
              {lock?.content[relativePath].digest}
            </span>
          </div>
          <div className="p-2">
            <span>Arweave Hash</span>:{' '}
            <span className="font-mono text-sm">
              {lock?.content[relativePath].arweaveHash}
            </span>
          </div>
        </div>
      </TutorialLayout>
    </>
  );
};

export async function getStaticPaths() {
  const { allPaths } = await getTutorialPaths();
  return {
    paths: [], // arweave download takes time. skip it
    fallback: 'blocking', // false or 'blocking' /
  };
}

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug as string[];
  const rootFolder = getPathForRootFolder(slug[0]);
  const { config, lock } = await getTutorialContentByPath({ rootFolder });
  const pathForFile = getPathForFile(slug[0], slug[1]);
  const relativePath = path.relative(rootFolder, pathForFile);

  const getPost = async (): Promise<{ content: string; data: any }> => {
    if (lock.content[relativePath].arweaveHash && NODE_ENV === 'production') {
      try {
        const arweave = await new ArweaveApi({
          appName: NEXT_PUBLIC_ARWEAVE_APP_NAME,
          host: NEXT_PUBLIC_ARWEAVE_HOST,
          port: parseInt(NEXT_PUBLIC_ARWEAVE_PORT),
          protocol: NEXT_PUBLIC_ARWEAVE_PROTOCOL,
        });
        const response = await arweave.getTutorialByHash(
          config.content[relativePath].arweaveHash,
        );
        if (response) {
          return getFileParse<PostType.TUTORIAL>(response.data);
        }
      } catch (err) {
        const file = await getFileFromGithub(slug[0], relativePath);
        return getFileParse<PostType.TUTORIAL>(file);
      }
    } else if (NODE_ENV === 'production') {
      const file = await getFileFromGithub(slug[0], relativePath);
      return getFileParse<PostType.TUTORIAL>(file);
    } else {
      return await getFileByPath<PostType.TUTORIAL>(pathForFile);
    }
  };

  const post = await getPost();

  const mdxSource = await serializeContent({
    content: post.content,
    data: post.data,
  });
  return {
    props: {
      config,
      lock,
      rootFolder,
      relativePath,
      post: { ...post, mdxSource },
      slug,
    },
    revalidate: 60 * 10, // In seconds
  };
};

export default TutorialPage;

// https://raw.githubusercontent.com/TheBuilderDAO/kafe/nk/md-formatter/tutorials/avalanche-create-a-local-test-network/content/index.mdx?token=GHSAT0AAAAAABOK2Q2R24VONMIVRUY3B2CEYSCW4AQ
// https://raw.githubusercontent.com/TheBuilderDAO/kafe/nk/md-formatter/tutorials/avalanche-create-a-local-test-network/content/index.mdx?token=GHSAT0AAAAAABOK2Q2QNKE3ZMG5VVQMGLA2YSCWQWQ
