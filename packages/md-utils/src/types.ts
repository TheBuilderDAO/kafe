import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export enum PostType {
  TUTORIAL = 'tutorial',
  BLOGPOST = 'blogPost',
  AUTHOR = 'author',
}

export type ReadingTime = {
  text: string;
};

export type PostFrontMatter = {
  colorFeatured?: string;
  cover?: string;
  date: string;
  updated: string;
  featured?: boolean;
  fontFeatured?: string;
  keywords?: string[];
  slug: string;
  subtitle: string;
  title: string;
  type: PostType.BLOGPOST;
};

export type PostFile = {
  frontMatter: PostFrontMatter & {
    readingTime: ReadingTime;
  };
  tweetIDs: string[];
  mdxSource: MDXRemoteSerializeResult;
};

export type TutorialFrontMatter = {
  colorFeatured?: string;
  cover?: string;
  date: string;
  language: string;
  slug: string;
  title: string;
  keywords?: string[];
  featured?: boolean;
  description: string;
  snippetImage: string;
  type: PostType.TUTORIAL;
};

export type TutorialFile = {
  content: string;
  data: any;
  frontMatter: TutorialFrontMatter;
  mdxSource: MDXRemoteSerializeResult;
};

export type FrontMatterPostType<T> = T extends PostType.BLOGPOST
  ? PostFile
  : TutorialFile;
