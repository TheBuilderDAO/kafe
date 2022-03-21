import { PublicKey } from '@solana/web3.js';
import * as commander from 'commander';
import path from 'path';
import fs from 'fs-extra';
import Rx from 'rxjs';
import async from 'async';
import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import simpleGit, { CleanOptions } from 'simple-git';

import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';
import { ArweaveApi, CeramicApi, TutorialMetadata } from '@builderdao/apis';
import { protocols, technologies } from '@builderdao/data';
import {
  TutorialProgramClient,
  filterAccountByFundedState,
  filterAccountBySlug,
} from '@builderdao-sdk/dao-program';

import { log as _log, hashSumDigest } from '../utils';
import { ArweaveApi, CeramicApi } from '@builderdao/apis';
import { log as _log, hashSumDigest, sleep } from '../utils';
import { BuilderDaoConfig } from '../services/builderdao-config.service';
import { TemplateService } from '../services/template.service';
import { getClient } from '../client';

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
    hashQueue.push(file);
  });
  await hashQueue.drain();
}

async function getReviewer(
  client: TutorialProgramClient,
  reviewerPK: PublicKey,
) {
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
  const rootTutorialFolderPath = path.join(__dirname, '../../../', 'tutorials');

  const tutorial = new commander.Command('tutorial').description('Tutorial');
  const client = getClient({
    kafePk: tutorial.optsWithGlobals().kafePk,
    network: tutorial.optsWithGlobals().network,
    payer: tutorial.optsWithGlobals().payer,
  });
  const log = (object: any) => _log(object, tutorial.optsWithGlobals().key);
  tutorial.command('list').action(async () => {
    const { allTutorials } = await getTutorialPaths(rootTutorialFolderPath);
    log(
      allTutorials.reduce((prev: any, curr) => {
        prev[curr.slug] = curr;
        return prev;
      }, {}),
    );
  });

  tutorial
    .command('get')
    .argument('<learnPackageName>', 'Tutorial name')
    .action(async learnPackageName => {
      const tutorialMetadata = await getTutorialContentByPackageName({
        rootFolderPath: rootTutorialFolderPath,
        learnPackageName,
      });
      log(tutorialMetadata);
    });

  tutorial
    .command('prepublish')
    .addOption(
      new commander.Option('--skip-reviewers', 'Skip reviewers').default(false)
    )
    .argument('[learnPackageName]', 'Tutorial name')
    .action(async (learnPackageName, options) => {
      console.log(options, learnPackageName); 
      const rootFolder = learnPackageName
        ? path.join(rootTutorialFolderPath, learnPackageName)
        : process.cwd();

      if (!options.skipReviewers) {
        const proposal = await client.getTutorialBySlug(learnPackageName);
        console.log(rootFolder);
        const { lock, initial } = new BuilderDaoConfig(rootFolder);
        const { lock: lockDefault } = await initial({
          proposalId: proposal.id.toNumber(),
          slug: proposal.slug as string,
        });
        await lock.read();
        lock.data ||= lockDefault;
        console.log(lock.data);
        await lock.write();
        lock.chain.set('proposalId', proposal.id.toNumber());
        const reviewer1 = await getReviewer(client, proposal.reviewer1);
        lock.chain.get('reviewers').set('reviewer1', reviewer1).value();
        const reviewer2 = await getReviewer(client, proposal.reviewer1);
        lock.chain.get('reviewers').set('reviewer2', reviewer2).value();
        await lock.write();
      }
      await updateHashDigestOfFolder(rootFolder);
    });

  tutorial
    .command('publish')
    .argument('[learnPackageName]', 'Tutorial name')
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
    .action(async (learnPackageName, options) => {
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
      const ceramicMetadata = await ceramic.getMetadata(proposal.streamId);
      ceramic.setSeed(options.seed)
      const arweave = new ArweaveApi({
        appName: options.arweave_appName,
        host: options.arweave_host,
        port: options.arweave_port,
        protocol: options.arweave_protocol,
      });
      console.log(proposal);
      console.log(ceramicMetadata);

      const deployQueue = async.queue(
        async (file: {
          path: string;
          name: string;
          digest: string;
          fullPath: string;
        }) => {
          console.log('Uploading', file.name);
          const fileContent = await fs.readFile(file.fullPath, 'utf8');
          const arweaveHash = await arweave.publishTutorial(
            fileContent,
            `${learnPackageName}/${file.path}`,
            options.arweave_wallet,
          );
          console.log(
            `Arweave Upload Complete: ${file.name} = [${arweaveHash}]`,
          );
          const digest = await hashSumDigest(file.fullPath);
          lock.chain.set(`content["${file.path}"].digest`, digest).value();
          lock.chain
            .set(`content["${file.path}"].arweaveHash`, arweaveHash)
            .value();
          await lock.write();
          console.log('Updated builderdao.lock.json');
        },
        2,
      );

      // Upload the files to arweave ad arweave hash to builderdao.config.json and also update ceramicMetadata.
      // Kicking initial process.
      const isReadyToPublish = Object.keys(proposal.state).some(
        (k: string) => k === 'readyToPublish',
      );
      const isPublished = Object.keys(proposal.state).some(
        (k: string) => k === 'published',
      );
      if (isReadyToPublish) {
        console.log('Kicking initial process.');
        Object.values(content).forEach(async file => {
          const filePath = path.join(rootFolder, file.path);
          deployQueue.push({
            ...file,
            fullPath: filePath,
          });
        });
        // Compare the content.*.digest of the proposal with the content of the ceramicMetadata and update the proposal if needed
        // find the files chagged and redopley them to arweave.
      } else if (isPublished) {
        console.log('Kicking update process.');
        Object.values(content).forEach(async file => {
          const filePath = path.join(rootFolder, file.path);
          const digest = await hashSumDigest(filePath);
          if (file.digest !== digest) {
            deployQueue.push({
              ...file,
              fullPath: filePath,
            });
          }
        });
      } else {
        tutorial.error(`
        🚧 The tutorial is not ready to publish/update. 🚧 state: ${Object.keys(proposal.state)[0]
          }
        `);
      }
      await deployQueue.drain();
      console.log('all items have been processed');

      // End of the ceramic & arweave process.
    });

  tutorial
    .command('init')
    .option('--slug <slug>', 'slug of the tutorial')
    .addOption(
      new commander.Option('--nodeUrl <nodeUrl>', 'Ceramic Node Url').env(
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
                filterAccountByFundedState,
                ...(options.slug ? [filterAccountBySlug(options.slug)] : []),
              ])
            ).map(data => `${data.account.slug}`),
        });
      });

      let proposalSlug: string;
      const getTutorialFolder = (slug: string) =>
        path.join(path.join(__dirname, '../../../tutorials'), slug);
      let proposal: any;
      let ceramicMetadata: TutorialMetadata;

      const git = simpleGit().clean(CleanOptions.FORCE);
      const ceramic = new CeramicApi({
        nodeUrl: options.nodeUrl,
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
            message: `Are you sure you want to create a tutorial for ${q.answer}?`,
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
                  'You have uncommitted changes. Are you sure you want to continue?',
                default: false,
              });
            } else {
              ui.log.write('Git status is clean. Continuing...');
            }
            emitter.next({
              type: 'confirm',
              name: 'proposal_git_checkout_confirm',
              message: `Are you confirm to checkout the branch "tutorials/${proposalSlug}" ?`,
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
              ui.log.write('Branch name correct.');
            }
          } else {
            ui.log.write('Skipping checkout branch');
          }

          const tutorialExist = await fs
            .access(getTutorialFolder(proposalSlug))
            .then(() => true)
            .catch(() => false);

          if (tutorialExist) {
            ui.log.write('Tutorial folder already exists');
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
                  name: 'Single page Tutorial',
                  value: 'simple',
                },
                {
                  name: 'Multi page Tutorial',
                  value: 'multipage',
                },
              ],
            });
          }
        }

        const template = new TemplateService(getTutorialFolder(proposalSlug));
        if (q.name === 'tutorial_file_creation_confirm') {
          ui.log.write('🚧 Creating tutorial folder...');
          await template.copy(q.answer);
          ui.log.write('🧱 Copying template folder...');
          await template.setName(proposalSlug);
          ui.log.write('🖌  Updating Slugs folder...');

          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug));
          const defaults = await config.initial({
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
          ui.log.write(`⛓ updating content folders`);
          emitter.next({
            type: 'input',
            name: 'tutorial_title',
            message: 'Tutorial title',
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
              'Please select the keywords you would like to use with a maximum of 5.',
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
          const tags = q.answer.map(t => ({
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
            ui.log.write('Staging changes');
            await git.add('./*');
            log(await (await git.status()).staged);
            ui.log.write('Adding Commit');
            await git.commit(`🚀 ${proposalSlug} Tutorial Initial`);
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
