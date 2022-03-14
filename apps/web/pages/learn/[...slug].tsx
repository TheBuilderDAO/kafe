import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import _ from 'lodash';
import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';
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
import { MDXComponents, MDXWrapper, Navbar, TOCInline } from '@builderdao/ui';
import React from 'react';
import { TutorialLayout } from 'layouts/tutorial-layout';
import { serializeContent } from '@app/lib/md/serializeContent';
import { ArweaveApi } from '@builderdao/apis';

const TutorialPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  const { mdxSource, frontMatter } = props.post;
  const {config, relativePath} = props
  console.log(config, relativePath);
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
        <title>Tutorial</title>
      </Head>
      <TutorialLayout
        frontMatter={frontMatter}
        next={frontMatter.next}
        prev={frontMatter.prev}
      >
        <MDXRemote components={MDXComponents} {...mdxSource} />
        <div className='p-2 border border-black divide-y-2 rounded-lg dark:border-white'>
          <div>
            <span>Digest</span>: {config?.content[relativePath].digest}
          </div>
          <div>
            <span>Arweave Hash</span>: {config?.content[relativePath].arweaveHash}
          </div>
          <pre>
          <code>
            {JSON.stringify(config, null, 2)}
          </code>
          </pre>

        </div>
      </TutorialLayout>
    </>
  );
};

export async function getStaticPaths() {
  const { allPaths } = await getTutorialPaths();
  return {
    paths: [], // arweave download takes time. skip it
    /**
     * // TODO: this will be failing some cases .
     * This could be 2 different fuction one in local dev which basically search for the package.json. another one could utilize the github raw api to get the mdx file.
     */
    fallback: true, // false or 'blocking' /
  };
}

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug as string[];
  const rootFolder = getPathForRootFolder(slug[0])
  const {config} = await getTutorialContentByPath({rootFolder});
  const pathForFile = getPathForFile(slug[0], slug[1]);
  const relativePath = path.relative(rootFolder, pathForFile)
  const getPost  = async (slug: string[]): Promise<{content: string, data: any}>  => {
    console.log('HASHHSHSHHSH', config.content[relativePath].arweaveHash)
    
    if (config.content[relativePath].arweaveHash && process.env.NODE_ENV === 'production')  {
      console.log({
        appName: process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME,
        host: process.env.NEXT_PUBLIC_ARWEAVE_HOST,
        port: parseInt(process.env.NEXT_PUBLIC_ARWEAVE_PORT),
        protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL,
      })
      const arweave =  await new ArweaveApi({
        appName: process.env.NEXT_PUBLIC_ARWEAVE_APP_NAME,
        host: process.env.NEXT_PUBLIC_ARWEAVE_HOST,
        port: parseInt(process.env.NEXT_PUBLIC_ARWEAVE_PORT),
        protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL,
      })
     const response =  await arweave.getTutorialByHash(config.content[relativePath].arweaveHash)
     console.log(response)
     
     if (response) {
      return getFileParse<PostType.TUTORIAL>(response.data)
     } else {
      return await getFileByPath<PostType.TUTORIAL>(pathForFile);
     }
    } else {
      return await getFileByPath<PostType.TUTORIAL>(pathForFile);
    }
  }

  const post = await getPost(slug);

  const mdxSource = await serializeContent({
    content: post.content,
    data: post.data,
  });
  return {
    props: {
      config,
      relativePath,
      post: { ...post, mdxSource,  },
      slug,
    },
  };
};

export default TutorialPage;
