import path from 'path';
import fs from 'fs-extra';

import matter from 'gray-matter';
import readingTime from 'reading-time';

import { FrontMatterPostType, PostType } from './types';

// Regex to find all the custom static tweets in a MDX file
const TWEET_RE = /<StaticTweet\sid="[0-9]+"\s\/>/g;

export const getFileByPath = async <T extends PostType>(
  pathForFile: string,
): Promise<FrontMatterPostType<T>> => {
  const source = await fs.readFile(pathForFile, 'utf8');
  return await getFileParse<T>(source);
};

export const getFileParse = async <T extends PostType>(source: string) => {
  const parsedFile = matter(source);

  const { data, content } = parsedFile;

  // TODO: maybe we want to extract this in its own lib?
  /**
   * Find all occurrence of <StaticTweet id="NUMERIC_TWEET_ID"/>
   * in the content of the MDX blog post
   */
  const tweetMatch = content.match(TWEET_RE);

  /**
   * For all occurrences / matches, extract the id portion of the
   * string, i.e. anything matching the regex /[0-9]+/g
   *
   * tweetIDs then becomes an array of string where each string is
   * the id of a tweet.
   * These IDs are then passed to the getTweets function to be fetched from
   * the Twitter API.
   */
  const tweetIDs = tweetMatch?.map(mdxTweet => {
    const id = mdxTweet.match(/[0-9]+/g)![0];
    return id;
  });

  const result = {
    data,
    content,
    tweetIDs: tweetIDs || [],
    frontMatter: {
      readingTime: readingTime(content),
      ...data,
    },
  };

  return result as unknown as FrontMatterPostType<T>;
};

const rootFolderPathForTutorials =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'public/tutorials')
    : path.join(process.cwd(), '..', '..', 'tutorials'); // TODO: make this direct path.

type TutorialPath = {
  params: {
    slug: string[];
  };
};

/**
 *
 * @returns
 */
export const getTutorialPaths = async (
  rootFolderPath = rootFolderPathForTutorials,
) => {
  const rootFolder = await fs.readdir(rootFolderPath);
  const allPaths: TutorialPath[] = [];
  const allTutorials = [];
  for (const learnPackageName of rootFolder) {
    if (learnPackageName === 'tutorials') {
      // ln -s reference.
      continue;
    }
    const { config, lock, content, paths } =
      await getTutorialContentByPackageName({
        learnPackageName,
        rootFolderPath,
      });
    allPaths.push(...paths);
    allTutorials.push({
      slug: learnPackageName,
      config,
      lock,
      content,
    });
  }
  return {
    allPaths,
    allTutorials,
  };
};

export const getTutorialContentByPackageName = async ({
  learnPackageName,
  rootFolderPath = rootFolderPathForTutorials,
}: {
  learnPackageName: string;
  rootFolderPath: string;
}) => {
  const rootFolder = path.join(rootFolderPath, learnPackageName);
  return getTutorialContentByPath({ rootFolder });
};

export const getTutorialContentByPath = async ({
  rootFolder,
}: {
  rootFolder: string;
}) => {
  const learnPackageName = path.basename(rootFolder);
  const paths: TutorialPath[] = [];
  const content: { name: string; path: string }[] = [];
  const getFiles = async (dir: string) => {
    return await fs.readdir(dir).then(async (fileOrDirs: string[]) => {
      const filtered = fileOrDirs.filter(file => !file.startsWith('.'));
      for (const fileOrDir of filtered) {
        const f = path.join(dir, fileOrDir);
        if (
          ['.md', '.mdx', '.png', '.jpg', '.jpeg', '.gif', '.svg'].some(ext =>
            f.endsWith(ext),
          )
        ) {
          const slugArray = [learnPackageName];
          if (fileOrDir.includes('index')) {
          } else {
            slugArray.push(fileOrDir.replace('.mdx', ''));
          }

          paths.push({
            params: {
              slug: slugArray,
            },
          });
          content.push({
            name: fileOrDir,
            path: f,
          });
          continue;
        }
        const fileMeta = await fs.lstatSync(f);
        if (fileMeta.isDirectory()) {
          await getFiles(f);
        }
      }
    });
  };
  getFiles(rootFolder);

  const rawConfigFile = await fs.readFile(
    path.join(rootFolder, 'builderdao.config.json'),
    'utf8',
  );
  const rawLockFile = await fs.readFile(
    path.join(rootFolder, 'builderdao.lock.json'),
    'utf8',
  );
  const config = JSON.parse(rawConfigFile);
  const lock = JSON.parse(rawLockFile);
  return {
    paths,
    content,
    config,
    lock,
  };
};

/**
 *
 * @param packageName the name of the package to get the content from (e.g. 'solana-wallet-tutorial') literaly name of the package.json except the '@builderdao-tutorials'
 * @param mdFileName  the name of the file to get the content from (e.g. 'getting-started') without the extension.
 * @returns  path to the file.
 */
export const getPathForFile = (
  packageName: string,
  mdFileName: string | undefined = 'index',
) => {
  return path.join(
    getPathForRootFolder(packageName),
    'content',
    `${mdFileName}.mdx`,
  );
};

export const getPathForRootFolder = (packageName: string) => {
  return path.join(rootFolderPathForTutorials, packageName);
};
