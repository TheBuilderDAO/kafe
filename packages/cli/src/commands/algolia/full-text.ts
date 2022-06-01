import async from 'async';
import path from 'path';
import * as commander from 'commander';

import { rootTutorialFolderPath } from 'src/constants';
import { BuilderDaoConfig } from 'src/services';
import { AlgoliaApi, TutorialContent } from '@builderdao/apis';
import { getFileByPath, getTutorialContentByPath, readFileByPath, serializeContent } from '@builderdao/md-utils';

export const AlgoliaFullTextCommand = () => {
  const algoliaFullText = new commander.Command('fulltext');
  algoliaFullText
    .description('Update full-index')
    .argument('[slug]', 'Tutorial slug')
    .addOption(
      new commander.Option('--appId <appId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--accessKey <accessKey>', 'Algolia Access Key')
        .env('ALGOLIA_ACCESS_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--indexName <indexName>', 'Algolia Index Name')
        // .env('ALGOLIA_INDEX_NAME')
        .default('tutorial_full_text')
        .makeOptionMandatory(),
    )
    .action(
      async (
        slug: string,
        options: {
          appId: string;
          accessKey: string;
          indexName: string;
        },
      ) => {
        const algoliaClient = new AlgoliaApi({
          appId: options.appId,
          accessKey: options.accessKey,
          indexName: options.indexName,
        });

        const rootFolder = slug
          ? path.join(rootTutorialFolderPath, slug)
          : process.cwd();
        const { lock, config } = new BuilderDaoConfig(rootFolder);
        await lock.read();
        await config.read();
        const proposalId = lock.chain.get('proposalId').value().toString();

        const tutorialMetadata = await getTutorialContentByPath({
          rootFolder,
        });

        const parseQueue = async.queue(
          async (file: { path: string; name: string; digest: string, arweaveHash?: string }) => {
            if (file.path.endsWith('.mdx')) {
              try {
                const content = await readFileByPath(file.path)
                const { frontMatter } = await getFileByPath(file.path)

                const { anchors } = await serializeContent({
                  content: content,
                  data: {
                    config: config.data,
                    lock: lock.data,
                    frontMatter
                  }
                })

                // await algoliaClient.addFulltextIndex(proposalId, anchors)
              } catch (err) {
                console.error(err)
              }
            }
          }, 2)


        tutorialMetadata.content.forEach(file => {
          parseQueue.push(file as TutorialContent);
        });
      })

  return algoliaFullText
}