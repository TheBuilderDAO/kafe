import * as commander from 'commander';
import path from 'path';
import fs from 'fs-extra';

import { hashSumDigest, log as _log } from 'src/utils';
import { rootTutorialFolderPath } from 'src/constants';
import { BuilderDaoConfig } from 'src/services';
import { getClient } from 'src/client';
import { CeramicApi, ArweaveApi } from '@builderdao/apis';
import async from 'async';
import _ from 'lodash';
import mimer from 'mimer';

const helpText = `
Example call:
  $ builderdao tutorial publish near-101

Notes:
  - The publish workflow adds the tutorial to Arweave and Ceramic.
`;


export const TutorialPublishCommand = () => {
  const tutorialPublish = new commander.Command('publish');
  const log = (object: any) => _log(object, tutorialPublish.optsWithGlobals().key);

  const client = getClient({
    kafePk: tutorialPublish.optsWithGlobals().kafePk,
    network: tutorialPublish.optsWithGlobals().network,
    payer: tutorialPublish.optsWithGlobals().payer,
  });

  tutorialPublish
    .description('Publish tutorial to Arweave & Ceramic')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      helpText,
    )
    .argument(
      '[learnPackageName]',
      'Tutorial slug for complete tutorial package',
    )
    .addOption(
      new commander.Option('--nodeUrl <nodeUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--seed <seed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--arweave_wallet <arweave_wallet>',
        'Arweave wallet',
      )
        .env('ARWEAVE_WALLET')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--arweave_appName <arweave_appName>',
        'Arweave App Name',
      )
        .env('ARWEAVE_APP_NAME')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--arweave_host <arweave_host>', 'Arweave Host')
        .env('ARWEAVE_HOST')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--arweave_port <arweave_port>', 'Arweave Port')
        .env('ARWEAVE_PORT')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--arweave_protocol <arweave_protocol>',
        'Arweave Protocol',
      )
        .env('ARWEAVE_PROTOCOL')
        .default('https'),
    )
    .addOption(
      new commander.Option('--skip-images', 'Skip uploading images').default(false)
    )
    .addOption(
      new commander.Option('--verbose', 'Verbose').default(false)
    )
    .addOption(
      new commander.Option('--force', 'Force').default(false)
    )
    .action(async (learnPackageName, options) => {
      if (options.verbose) {
        log(options);
        console.log('-'.repeat(120))
      }
      const rootFolder = learnPackageName
        ? path.join(rootTutorialFolderPath, learnPackageName)
        : process.cwd();
      if (!rootFolder.includes('/tutorials/')) {
        tutorialPublish.error('No tutorial found in this folder')
        return
      }
      log({ rootFolder });
      const { lock } = new BuilderDaoConfig(rootFolder);
      await lock.read();
      const proposalId = lock.chain.get('proposalId').parseInt().value();
      const proposal = await client.getTutorialById(proposalId);
      const content = lock.chain.get('content').value();
      const ceramic = new CeramicApi({
        nodeUrl: options.nodeUrl,
      });
      const ceramicMetadata = await ceramic.getMetadata(
        proposal.streamId as string,
      );
      ceramic.setSeed(options.seed);
      const arweave = new ArweaveApi({
        host: options.arweave_host,
        port: options.arweave_port,
        protocol: options.arweave_protocol,
      });
      log(proposal);
      console.log('-'.repeat(120))
      log(ceramicMetadata);

      const deployQueue = async.queue(
        async (file: {
          path: string;
          name: string;
          digest: string;
          fullPath: string;
          arweaveHash?: string;
          options?: {
            skipArweave?: boolean;
            skipCeramic?: boolean;
          }
        }) => {
          try {
            console.log(`in deploy queue- ${file.name} - `);
            console.log({ file })
            const fileContent = await fs.readFile(file.fullPath, 'utf8');
            const digest = await hashSumDigest(file.fullPath);
            const isImage = /\.(png|jpg|jpeg|gif)$/.test(file.path)
            const shouldSkipArweave = !file.options?.skipArweave || isImage && options.skipImages;
            if (!shouldSkipArweave) {
              const arweaveHash = await arweave.publishTutorial(
                fileContent,
                options.arweave_wallet,
                {
                  'App-Name': options.arweave_appName,
                  'Slug': `/${proposal.slug}/${file.path}`,
                  'Content-Type': mimer(file.path),
                  'Address': proposal.creator.toString(),
                }
              );
              console.log(
                `⛓ Arweave Upload Complete: ${file.name} = [${arweaveHash}]`,
              );
              lock.chain.set(`content["${file.path}"].digest`, digest).value();
              lock.chain
                .set(`content["${file.path}"].arweaveHash`, arweaveHash)
                .value();
              await lock.write();
              console.log('🔒 Updated builderdao.lock.json!');
            } else {
              console.log(`Skipping Arweave Upload`)
            }
            await lock.read();
            console.log('🔶 Updating ceramic metadata');
            if (!file.options?.skipCeramic) {
              try {
                const updatedFile = lock.chain.get(`content["${file.path}"]`).value();
                const ceramicMetadataForFile = _.get(ceramicMetadata, `content["${file.path}"]`);
                const isCeramicDataSync = _.isEqual(updatedFile, ceramicMetadataForFile)
                if (isCeramicDataSync) {
                  log({
                    message: "Skiping ceramic update because it's already synced",
                    ...ceramicMetadataForFile,
                  })
                } else {
                  const updatedMetadata = _.set(ceramicMetadata, `content["${file.path}"]`, updatedFile);
                  await ceramic.updateMetadata(proposal.streamId, {
                    ...updatedMetadata,
                  })
                  console.log('🔶 Updated ceramic metadata');
                }
              } catch (err) {
                console.log('🔶 Failed to update ceramic metadata');
                console.log(err);
              }
            }
          } catch (err) {
            console.log(err);
            console.log('🔒 Failed to update builderdao.lock.json!');
          }
        },
        2,
      );

      // Upload the files to Arweave, add Arweave hash to builderdao.config.json and also update ceramicMetadata.
      // Kicking initial process.
      const isReadyToPublish = Object.keys(proposal.state).some(
        (k: string) => k === 'readyToPublish',
      );
      const isPublished = Object.keys(proposal.state).some(
        (k: string) => k === 'published',
      );

      const files = Object.values(content)
      if (isReadyToPublish || isPublished) {
        console.log('Kicking initial process.');
        files.forEach(async file => {
          const filePath = path.join(rootFolder, file.path);
          const digest = await hashSumDigest(filePath);

          // Compare the content.*.digest of the proposal with the content of the ceramicMetadata
          // and update the proposal if needed, then find the changed files and redeploy them to Arweave.
          if (file.arweaveHash && file.digest === digest && !options.force) {
            log({
              SKIPPING: {
                reason: `Skipping file it is already uploaded.`,
                ...file
              }
            })

            deployQueue.push({
              ...file,
              fullPath: filePath,
              options: {
                skipArweave: true,
              }
            });
          } else {
            deployQueue.push({
              ...file,
              fullPath: filePath,
            });
          }
        });
      } else {
        tutorialPublish.error(`
        🛑 The tutorial is not ready to publish/update. 🚧 state: ${Object.keys(proposal.state)[0]
          }
        `);
      }
      await deployQueue.drain();
      // End of the Ceramic & Arweave process.
      log(await client.getTutorialById(proposalId));
      console.log('-'.repeat(120))
      log(await ceramic.getMetadata(
        proposal.streamId as string,
      ));
      console.log('✅ All items have been processed!');
    });
  return tutorialPublish;;
}