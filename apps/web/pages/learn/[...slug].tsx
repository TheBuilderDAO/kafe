import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import _ from 'lodash';
import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';
import {
  getFileByPath,
  getPathForFile,
  getTutorialPaths,
  PostType,
} from '@builderdao/md-utils';
import { MDXComponents, MDXWrapper, Navbar, TOCInline } from '@builderdao/ui';
import React from 'react';
import { TutorialLayout } from 'layouts/tutorial-layout';
import { serializeContent } from '@app/lib/md/serializeContent';

const TutorialPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  const { mdxSource, frontMatter } = props.post;
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
      </TutorialLayout>
    </>
  );
};

export async function getStaticPaths() {
  const { allPaths } = await getTutorialPaths();
  return {
    paths: allPaths,
    /**
     * // TODO: this will be failing some cases .
     * This could be 2 different fuction one in local dev which basically search for the package.json. another one could utilize the github raw api to get the mdx file.
     */
    fallback: true, // false or 'blocking' /
  };
}

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug as string[];
  const pathForFile = getPathForFile(slug[0], slug[1]);
  const post = await getFileByPath<PostType.TUTORIAL>('learn', pathForFile);
  const mdxSource = await serializeContent({
    content: post.content,
    data: post.data,
  });
  return {
    props: {
      post: { ...post, mdxSource },
      slug,
    },
  };
};

export default TutorialPage;
