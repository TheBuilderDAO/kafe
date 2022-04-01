/* eslint-disable no-console */
import { PublicKey } from '@solana/web3.js';
import * as commander from 'commander';
import path from 'path';
import fs from 'fs-extra';
import Rx from 'rxjs';
import async from 'async';
import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import simpleGit, { CleanOptions } from 'simple-git';
import * as mime from 'mime';


import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';
import { ArweaveApi, CeramicApi, TutorialMetadata } from '@builderdao/apis';
import { protocols, technologies } from '@builderdao/data';
import {
  TutorialProgramClient,
  ProposalStateE,
  filterProposalByState,
  filterProposalBySlug,
} from '@builderdao-sdk/dao-program';

import { log as _log, hashSumDigest } from '../utils';
import { BuilderDaoConfig } from '../services/builderdao-config.service';
import { TemplateService } from '../services/template.service';
import { getClient } from '../client';
import { rootTutorialFolderPath } from '../constants';
import _ from 'lodash';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

async function updateHashDigestOfFolder(rootFolder: string) {
  const tutorialMetadata = await getTutorialContentByPath({
    rootFolder,
  });
  const { lock: db } = new BuilderDaoConfig(rootFolder);
  await db.read();
  const hashQueue = async.queue(
    async (file: { path: string; name: string; digest: string }) => {
      const digest = await hashSumDigest(file.path);
      const relativePath = path.relative(rootFolder, file.path);
      const prev = db.chain.get(`content["${relativePath}"]`).value();
      db.chain
        .set(`content["${relativePath}"]`, {
          ...prev,
          name: file.name,
          path: relativePath,
          digest,
        })
        .value();
      await db.write();
    },
    2,
  );
  tutorialMetadata.content.forEach(file => {
    hashQueue.push(file as TutorialMetadata);
  });
  await hashQueue.drain();
}

async function getReviewer(
  client: TutorialProgramClient,
  reviewerPK: PublicKey,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatReviewer = (data: any) => ({
    pda: data.pda,
    pubkey: data.pubkey,
    githubName: data.githubName,
  });
  const reviewer = await client
    .getReviewerByReviewerPk(reviewerPK)
    .then(formatReviewer);
  return reviewer;
}

export function makeTutorialCommand() {

  const tutorial = new commander.Command('tutorial')
    .addHelpCommand(false)
    .description('Initialize & publish Kafé tutorials')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  const client = getClient({
    kafePk: tutorial.optsWithGlobals().kafePk,
    network: tutorial.optsWithGlobals().network,
    payer: tutorial.optsWithGlobals().payer,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (object: any) => _log(object, tutorial.optsWithGlobals().key);

  tutorial
    .command('list')
    .description('List all tutorials and metadata')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao tutorial list`,
    )
    .action(async () => {
      const { allTutorials } = await getTutorialPaths(rootTutorialFolderPath);
      log(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allTutorials.reduce((prev: any, curr) => {
          // eslint-disable-next-line no-param-reassign
          prev[curr.slug] = curr;
          return prev;
        }, {}),
      );
    });


  tutorial
    .command('get')
    .description('Display metadata for a single tutorial')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao tutorial get near-101`,
    )
    .argument(
      '<learnPackageName>',
      'Tutorial slug for complete tutorial package',
    )
    .action(async learnPackageName => {
      const tutorialMetadata = await getTutorialContentByPackageName({
        rootFolderPath: rootTutorialFolderPath,
        learnPackageName,
      });
      log(tutorialMetadata);
    });

  tutorial
    .command('prepublish')
    .argument(
      '[learnPackageName]',
      'Tutorial slug for complete tutorial package',
    )
    .addOption(
      new commander.Option('--skip-reviewers', 'Skip reviewers').default(false)
    )
    .addOption(
      new commander.Option('--force', 'Force Rewrite the lock file base on slug').default(false)
    )
    .description('Perform pre-publishing tasks')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao tutorial prepublish near-101

Notes:
  - The prepublish workflow deals with the builderdao-config.service to generate the 
  builderdao config and lock files, also updating the hash digest of the tutorial folder.
`,
    )
    .action(async (learnPackageName, options) => {
      const rootFolder = learnPackageName
        ? path.join(rootTutorialFolderPath, learnPackageName)
        : process.cwd();
      const { lock } = new BuilderDaoConfig(rootFolder);
      await lock.read()
      if (!options.skipReviewers) {
        const proposal = await client.getTutorialBySlug(lock.chain.get('slug').value());
        const { lock: lockDefault } = await BuilderDaoConfig.initial({
          proposalId: proposal.id.toNumber(),
          slug: proposal.slug as string,
        });
        await lock.read();
        lock.data ||= lockDefault;
        await lock.write();
        lock.chain.set('proposalId', proposal.id.toNumber());
        const reviewer1 = await getReviewer(client, proposal.reviewer1);
        lock.chain.get('reviewers').set('reviewer1', reviewer1).value();
        const reviewer2 = await getReviewer(client, proposal.reviewer1);
        lock.chain.get('reviewers').set('reviewer2', reviewer2).value();
        await lock.write();
      }
      if (options.force) {
        const proposal = await client.getTutorialBySlug(lock.chain.get('slug').value());
        lock.chain.set('proposalId', proposal.id.toNumber()).value();
        lock.chain.set('creator', proposal.creator).value();
        lock.write();
      }
      await updateHashDigestOfFolder(rootFolder);
      await lock.read()
      log(lock.data);
    });

  tutorial
    .command('publish')
    .description('Publish tutorial to Arweave & Ceramic')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao tutorial publish near-101

Notes:
  - The publish workflow adds the tutorial to Arweave and Ceramic.
  `,
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
          const fileContent = await fs.readFile(file.fullPath, 'utf8');
          const digest = await hashSumDigest(file.fullPath);
          if (!file.options?.skipArweave) {
            const arweaveHash = await arweave.publishTutorial(
              fileContent,
              options.arweave_wallet,
              {
                'App-Name': options.arweave_appName,
                'Slug': `/${proposal.slug}/${file.path}`,
                'Content-Type': mime.contentType('text/ plain'),
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

      const files = Object.values(content).filter(file => {
        if (options.skipImages) {
          if (/\.(png|jpg|jpeg|gif)$/.test(file.path)) {
            return false;
          }
        }
        return true;
      });
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
                skipArweave: options.force,
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
        tutorial.error(`
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

  tutorial
    .command('init')
    .description('Initialize a tutorial package from a proposal')
    .helpOption('-h, --help', 'Display help for command')
    .option('--slug <slug>', 'Slug of the tutorial')
    .addOption(
      new commander.Option('--nodeURL <nodeURL>', 'Ceramic node URL').env(
        'CERAMIC_NODE_URL',
      ),
    )
    .action(async options => {
      let emitter: Rx.Subscriber<DistinctQuestion<Answers>>;
      const observe = new Rx.Observable<DistinctQuestion<Answers>>(obs => {
        emitter = obs;
        emitter.next({
          type: 'autocomplete',
          name: 'proposal_slug',
          message: 'Project Slug',
          source: async () =>
            (
              await client.getProposals([
                filterProposalByState(ProposalStateE.funded),
                ...(options.slug ? filterProposalBySlug(options.slug) : []),
              ])
            ).map(data => `${data.account.slug}`),
        });
      });

      let proposalSlug: string;
      const getTutorialFolder = (slug: string) =>
        path.join(path.join(__dirname, '../../../tutorials'), slug);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let proposal: any;
      let ceramicMetadata: TutorialMetadata;

      const git = simpleGit().clean(CleanOptions.FORCE);
      const ceramic = new CeramicApi({
        nodeUrl: options.nodeURL,
      });
      const ui = new inquirer.ui.BottomBar();
      inquirer.prompt(observe).ui.process.subscribe(async q => {
        if (q.name === 'proposal_slug') {
          proposalSlug = q.answer;
          proposal = await client.getTutorialBySlug(proposalSlug);
          ceramicMetadata = await ceramic.getMetadata(proposal.streamId);
          log(ceramicMetadata);
          ui.log.write('-'.repeat(80));

          log(proposal);
          emitter.next({
            type: 'confirm',
            name: 'proposal_confirm',
            message: `🤔 Are you sure you want to create a tutorial for ${q.answer}?`,
          });
          return;
        }

        if (q.name === 'proposal_confirm') {
          if (q.answer) {
            if (!(await git.status()).isClean()) {
              emitter.next({
                type: 'confirm',
                name: 'proposal_git_confirm',
                message:
                  '⚠️ You have uncommitted changes. Are you sure you want to continue?',
                default: false,
              });
            } else {
              ui.log.write('🧼 Git status is clean. Continuing...');
            }
            emitter.next({
              type: 'confirm',
              name: 'proposal_git_checkout_confirm',
              message: `🤔 Are you sure you want to checkout the branch "tutorials/${proposalSlug}" ?`,
            });
          } else {
            ui.log.write('Okay 🤷, exiting...');
            emitter.complete();
          }
        }
        const targetBranchName = `tutorials/${proposalSlug}`;
        if (q.name === 'proposal_git_checkout_confirm') {
          if (q.answer === true) {
            if ((await git.branchLocal()).current !== targetBranchName) {
              await git.checkoutLocalBranch(`tutorials/${proposalSlug}`);
            } else {
              ui.log.write('✅ Branch name correct.');
            }
          } else {
            ui.log.write('⏩ Skipping checkout of branch.');
          }

          const tutorialExist = await fs
            .access(getTutorialFolder(proposalSlug))
            .then(() => true)
            .catch(() => false);

          if (tutorialExist) {
            ui.log.write('⚠️ Tutorial folder already exists!');
            emitter.complete();
          } else {
            emitter.next({
              type: 'list',
              name: 'tutorial_file_creation_confirm',
              message: `Select tutorial type "${getTutorialFolder(
                proposalSlug,
              )}" ?`,
              choices: [
                {
                  name: '📄 Single page Tutorial',
                  value: 'simple',
                },
                {
                  name: '📖 Multi page Tutorial',
                  value: 'multipage',
                },
              ],
            });
          }
        }

        const template = new TemplateService(getTutorialFolder(proposalSlug));
        if (q.name === 'tutorial_file_creation_confirm') {
          ui.log.write('🏗 Creating tutorial folder...');
          await template.copy(q.answer);
          ui.log.write('🧱 Copying template folder...');
          await template.setName(proposalSlug);
          ui.log.write('🚧  Updating slugs folder...');

          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug));
          const defaults = await BuilderDaoConfig.initial({
            proposalId: proposal.id.toNumber(),
            slug: proposal.slug,
          });
          config.config.data ||= defaults.config;
          config.lock.data ||= defaults.lock;

          if (proposal.reviewer1.toString() !== PublicKey.default.toString()) {
            const reviewer1 = await getReviewer(client, proposal.reviewer1);
            ui.log.write(`🕵️‍♂️ Adding Reviewer 1... ${reviewer1.githubName}`);
            config.lock.chain
              .get('reviewers')
              .set('reviewer1', reviewer1)
              .value();
            await config.lock.write();
          } else {
            ui.log.write('No Reviewer1 found yet.');
          }
          if (proposal.reviewer2.toString() !== PublicKey.default.toString()) {
            const reviewer2 = await getReviewer(client, proposal.reviewer2);
            ui.log.write(`🧙‍♂️ Adding Reviewer 2... ${reviewer2.githubName}`);
            config.lock.chain
              .get('reviewers')
              .set('reviewer2', reviewer2)
              .value();
            await config.lock.write();
          } else {
            ui.log.write('No Reviewer2 found yet.');
          }
          await updateHashDigestOfFolder(getTutorialFolder(proposalSlug));
          ui.log.write(`⛓ Updating content folders`);
          emitter.next({
            type: 'input',
            name: 'tutorial_title',
            message: 'Tutorial Title',
            default: ceramicMetadata.title,
          });
        }

        if (q.name === 'tutorial_title') {
          await template.setTitle(q.answer);
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug));
          await config.config.read();
          config.config.chain.set('title', q.answer).value();
          await config.config.write();

          emitter.next({
            type: 'input',
            name: 'tutorial_description',
            message: 'Tutorial Description',
            default: ceramicMetadata.description,
          });
        }

        if (q.name === 'tutorial_description') {
          await template.setDescription(q.answer);
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug));
          await config.config.read();
          config.config.chain.set('description', q.answer).value();
          await config.config.write();
          emitter.next({
            type: 'checkbox',
            name: 'tutorial_tags',
            message:
              'Please select the keywords you would like to use (maximum of 5).',
            choices: [
              new inquirer.Separator(' = Protocols = '),
              ...protocols.map(protocol => ({
                name: protocol,
                checked: ceramicMetadata.tags.includes(protocol),
              })),
              new inquirer.Separator(' = Technologies = '),
              ...technologies.map(tech => ({
                name: tech,
                checked: ceramicMetadata.tags.includes(tech),
              })),
            ],
            validate(answer) {
              if (answer.length < 1) {
                return 'You must choose at least one tag.';
              }
              return true;
            },
          });
        }

        if (q.name === 'tutorial_tags') {
          await template.setTags(q.answer.join(','));
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug));
          await config.config.read();
          const tags = q.answer.map((t: string) => ({
            name: t,
            slug: t.toLowerCase(),
          }));
          config.config.chain.set('categories', tags).value();
          await config.config.write();
          emitter.next({
            type: 'confirm',
            name: 'push_changes',
            message: 'Push Changes',
          });
        }

        if (q.name === 'stage_changes') {
          if (q.answer) {
            ui.log.write('🧬 Staging changes');
            await git.add('./*');
            log(await (await git.status()).staged);
            ui.log.write('Adding Commit');
            await git.commit(`🚀 ${proposalSlug} Tutorial Initialized`);
            emitter.next({
              type: 'confirm',
              name: 'push_changes',
              message: 'Push Changes',
            });
          } else {
            emitter.complete();
          }
        }

        if (q.name === 'push_changes') {
          if (q.answer) {
            await git.push(['-u', 'origin', `tutorials/${proposalSlug}`]);
            ui.log.write(`🧱 [${proposalSlug}] Tutorial Initialized`);
          }
          emitter.complete();
        }
      });
    });
  return tutorial;
}
