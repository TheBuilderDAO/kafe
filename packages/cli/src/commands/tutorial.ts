import * as commander from 'commander';
import path from 'path';
import { promises as fs } from 'fs'
import Rx from 'rxjs'
import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';
import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { binary_to_base58 } from 'base58-js'

import { log as _log, hashSumDigest } from '../utils';
import { BuilderDaoConfig } from '../services/builderdao-config.service';
import { getClient } from '../client';
import simpleGit, { CleanOptions } from 'simple-git';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export function makeTutorialCommand() {
  const rootFolderPath = path.join(
    __dirname,
    '../../../',
    'node_modules',
    '@builderdao-learn',
  );

  const tutorial = new commander.Command('tutorial').description('Tutorial');
  let client = getClient({
    kafePk: tutorial.optsWithGlobals().kafePk,
    network: tutorial.optsWithGlobals().network,
    payer: tutorial.optsWithGlobals().payer,
  })
  const log = (object: any) => _log(object, tutorial.optsWithGlobals().key);
  tutorial.command('list').action(async () => {
    const { allTutorials } = await getTutorialPaths(rootFolderPath);
    log(allTutorials.reduce((prev: any, curr) => {
      prev[curr.slug] = curr
      return prev
    }, {}));
  });

  tutorial
    .command('get')
    .argument('<learnPackageName>', 'Tutorial name')
    .action(async learnPackageName => {
      const tutorialMetadata = await getTutorialContentByPackageName({
        rootFolderPath,
        learnPackageName,
      });
      log(tutorialMetadata);
    });

  tutorial
    .command('prepublish')
    .argument('[learnPackageName]', 'Tutorial name')
    .action(async learnPackageName => {
      const rootFolder = learnPackageName
        ? path.join(rootFolderPath, learnPackageName)
        : process.cwd();
      const tutorialMetadata = await getTutorialContentByPath({
        rootFolder,
      });
      const { db } = new BuilderDaoConfig(rootFolder)
      await db.read()
      // const content = db.data?.content || {}
      // for (const file of tutorialMetadata.content) {
      await db.read()
      tutorialMetadata.content.forEach(async file => {
        const digest = await hashSumDigest(file.path);
        const relativePath = path.relative(rootFolder, file.path);
        db.chain
          .set(`content["${relativePath}"]`, {
            name: file.name,
            path: relativePath,
            digest
          }).value()
        await db.write();
      })
    });

  tutorial.command('init')
    .action(async () => {
      // const a = await client.getTutorialById(0);
      // const rootFolder = path.join(rootFolderPath, a.slug);
      // console.log(a);

      // const b = await fs.access(rootFolder).then(() => true).catch(() => false);
      // if (b) {
      //   throw tutorial.error('Tutorial already exists')
      // }
      let emitter: Rx.Subscriber<DistinctQuestion<Answers>>;
      const observe = new Rx.Observable<DistinctQuestion<Answers>>((obs) => {
        emitter = obs;
        emitter.next({
          type: 'autocomplete',
          name: 'proposal_slug',
          message: "Project Slug",
          source: async (an: any, input: string) => {
            let proposals = []
            if (!input) {
              proposals = await client.getProposals()
            } else {
              proposals = await client.getProposals([
                {
                  memcmp: {
                    offset: 134,
                    bytes: binary_to_base58(Buffer.from(input)),
                  },
                },
              ])
            }
            return proposals.map(data => `${data.account.slug}`)
          }
        });
      });

      let proposalSlug: string; 
      let proposal;
      const git = simpleGit().clean(CleanOptions.FORCE)
      inquirer.prompt(observe).ui.process.subscribe(async q => {

        switch (q.name) {
          case 'proposal_slug': {
            proposalSlug = q.answer;
            proposal = await client.getTutorialBySlug(proposalSlug);
            log(proposal)
            emitter.next({
              type: "confirm",
              name: "proposal_confirm",
              message: `Are you sure you want to create a tutorial for ${q.answer}?`,
            });
            break;
          }
          case 'proposal_confirm': {
            if (q.answer) {
              const remoteOrigin = await git.remote(['get-url', 'origin'])
              if (remoteOrigin === 'git@github.com:TheBuilderDAO/kafe.git') {
                emitter.next({
                  type: "confirm",
                  name: "proposal_git_fork_confirm",
                  message: "Looks like you didn't fork the repository yet. Do you want to contuine ?",
                });
              }
              if ((await git.status()).isClean()) {
                git.checkoutBranch(`tutorials/${proposalSlug}`, 'main')
              } else {
                emitter.next({
                  type: "confirm",
                  name: "proposal_git_confirm",
                  message: "You have uncommitted changes. Are you sure you want to continue?",
                });
              }
              // emitter.
            }
            break;
          }
          case 'proposal_git_checkout_confirm': {
            if (q.answer) {
              git.checkoutBranch(`tutorials/${proposalSlug}`, 'main')
            } else {
              emitter.complete()
            }
            break;
          }
          case 'file_creation_confirm': {
            if (q.answer) {
              console.log('create folder')
            }
            break;
          }
          default: {
            emitter.complete()
          }
        }
        console.log(q);
      })
      // const config = new BuilderDaoConfig(rootFolder)
    })


  return tutorial;
}
