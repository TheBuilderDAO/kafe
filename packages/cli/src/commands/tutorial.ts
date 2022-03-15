import * as commander from 'commander';
import path from 'path';
import fs from 'fs-extra'
import Rx from 'rxjs'
import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';
import inquirer, { Answers, DistinctQuestion } from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { binary_to_base58 } from 'base58-js'
import simpleGit, { CleanOptions } from 'simple-git';

import { log as _log, hashSumDigest, sleep } from '../utils';
import { BuilderDaoConfig } from '../services/builderdao-config.service';
import { TemplateService } from '../services/template.service';
import { getClient } from '../client';
import { ArweaveApi, CeramicApi } from '@builderdao/apis';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

async function updateHashDigestOfFolder(rootFolder: string) {
  const tutorialMetadata = await getTutorialContentByPath({
    rootFolder,
  });
  const { db } = new BuilderDaoConfig(rootFolder)
  await db.read()
  tutorialMetadata.content.forEach(async file => {
    const digest = await hashSumDigest(file.path);
    const relativePath = path.relative(rootFolder, file.path);
    const prev = db.chain.get(`content["${relativePath}"]`).value()
    db.chain
      .set(`content["${relativePath}"]`, {
        ...prev,
        name: file.name,
        path: relativePath,
        digest
      }).value()
    await db.write();
  })
}


export function makeTutorialCommand() {
  const rootTutorialFolderPath = path.join(
    __dirname,
    '../../../',
    'tutorials'
  );

  const tutorial = new commander.Command('tutorial').description('Tutorial');
  let client = getClient({
    kafePk: tutorial.optsWithGlobals().kafePk,
    network: tutorial.optsWithGlobals().network,
    payer: tutorial.optsWithGlobals().payer,
  })
  const log = (object: any) => _log(object, tutorial.optsWithGlobals().key);
  tutorial.command('list').action(async () => {
    const { allTutorials } = await getTutorialPaths(rootTutorialFolderPath);
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
        rootFolderPath: rootTutorialFolderPath,
        learnPackageName,
      });
      log(tutorialMetadata);
    });

  tutorial
    .command('prepublish')
    .argument('[learnPackageName]', 'Tutorial name')
    .action(async learnPackageName => {
      const rootFolder = learnPackageName
        ? path.join(rootTutorialFolderPath, learnPackageName)
        : process.cwd();
      await updateHashDigestOfFolder(rootFolder)
    });

  tutorial.command('publish')
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
      new commander.Option('--arweave_wallet <arweave_wallet>', 'Arweave wallet')
        .env('ARWEAVE_WALLET')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--arweave_appName <arweave_appName>', 'Arweave App Name')
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
      new commander.Option('--arweave_protocol <arweave_protocol>', 'Arweave Protocol')
        .env('ARWEAVE_PROTOCOL')
        .default('https')
    )
    .action(async (learnPackageName, options) => {
      const rootFolder = learnPackageName
        ? path.join(rootTutorialFolderPath, learnPackageName)
        : process.cwd();
      console.log(rootFolder);
      const config = new BuilderDaoConfig(rootFolder)
      await config.db.read();
      const proposalId = config.db.chain.get('proposalId').parseInt().value()
      const proposal = await client.getTutorialById(proposalId)
      const content = config.db.chain.get('content').value();
      const ceramic = new CeramicApi({
        nodeUrl: options.nodeUrl,
        seed: options.seed,
      });
      const arweave = new ArweaveApi({
        appName: options.arweave_appName,
        host: options.arweave_host,
        port: options.arweave_port,
        protocol: options.arweave_protocol
      });
      const ceramicMetadata = await ceramic.getMetadata(proposal.streamId);
      console.log(proposal)
      console.log(ceramicMetadata);

      const toDeployFiles = [];
      console.log({
        proposal,
        ceramicMetadata,
        data: config.db.data
      })
      if (Object.keys(proposal.state).some((k: string) => k === 'readyToPublish')) {
        console.log('Kicking initial process.')
        Object.values(content).forEach(async (file) => {
          console.log(file)
          const filePath = path.join(rootFolder, file.path);
          toDeployFiles.push({
            ...file,
            fullPath: filePath,
          })
          // const fileDigest = await hashSumDigest(filePath);
          // if (fileDigest !== file.digest) {
          //   toDeployFiles.push(file);
          // }
        })
        // Compare the content.*.digest of the proposal with the content of the ceramicMetadata and update the proposal if needed 
        // find the files chagged and redopley them to arweave.
      } else if (Object.keys(proposal.state).some((k: string) => k === 'published')) {
        console.log("Kicking update process.")
        // Upload the files to arweave ad arweave hash to builderdao.config.json and also update ceramicMetadata.
        // Kicking initial process.
      } else {
        tutorial.error(`
        🚧 The tutorial is not ready to publish/update. 🚧 state: ${Object.keys(proposal.state)[0]}
        `)
      }

      if (toDeployFiles.length > 0) {
        console.log("Starting Uploading to Arweave")
        toDeployFiles.forEach(async (file) => {
          console.log('Uploading', file.name)
          const fileContent = await fs.readFile(file.fullPath, 'utf8');
          const arweaveHash = await arweave.publishTutorial(fileContent, `${learnPackageName}/${file.path}`, options.arweave_wallet)
          console.log(`Arweave Upload Complete: ${file.name} = [${arweaveHash}]`)
          config.db.chain.set(`content["${file.path}"].digest`, hashSumDigest(file.fullPath)).value()
          config.db.chain.set(`content["${file.path}"].arweaveHash`, arweaveHash).value()
          await config.db.write();
          console.log('Updated builderdao.config.json')
          // await ceramic.updateMetadata(proposal.streamId, {content: {[file.path]: arweaveHash}})
          // console.log('Updated ceramic metadata')
        })
      }
      // End of the ceramic & arweave process.
    })

  tutorial.command('init')
    .action(async () => {
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
      const getTutorialFolder = (slug: string) => path.join(path.join(__dirname, '../../../tutorials'), slug);
      let proposal: any;
      const git = simpleGit().clean(CleanOptions.FORCE)
      const ui = new inquirer.ui.BottomBar();
      inquirer.prompt(observe).ui.process.subscribe(async (q) => {
        if (q.name === 'proposal_slug') {
          proposalSlug = q.answer;
          proposal = await client.getTutorialBySlug(proposalSlug);
          log(proposal)
          emitter.next({
            type: "confirm",
            name: "proposal_confirm",
            message: `Are you sure you want to create a tutorial for ${q.answer}?`,
          });
          return;
        }

        if (q.name === 'proposal_confirm') {
          if (q.answer) {
            if (!(await git.status()).isClean()) {
              emitter.next({
                type: "confirm",
                name: "proposal_git_confirm",
                message: "You have uncommitted changes. Are you sure you want to continue?",
                default: false,
              });
            } else {
              ui.log.write('Git status is clean. Continuing...');
            }
            emitter.next({
              type: "confirm",
              name: "proposal_git_checkout_confirm",
              message: `Are you confirm to checkout the branch "tutorials/${proposalSlug}" ?`,
            })
          }
        }
        const targetBranchName = `tutorials/${proposalSlug}`
        if (q.name === 'proposal_git_checkout_confirm') {
          if (q.answer === true) {
            if ((await git.branchLocal()).current !== targetBranchName) {
              await git.checkoutLocalBranch(`tutorials/${proposalSlug}`)
            } else {
              ui.log.write('Branch name correct.')
            }
          } else {
            ui.log.write('Skipping checkout branch')
          }

          const tutorialExist = await fs.access(getTutorialFolder(proposalSlug))
            .then(() => true)
            .catch(() => false)

          if (tutorialExist) {
            ui.log.write('Tutorial folder already exists')
            emitter.complete();
          } else {
            emitter.next({
              type: "list",
              name: "tutorial_file_creation_confirm",
              message: `Select tutorial type "${getTutorialFolder(proposalSlug)}" ?`,
              choices: [
                {
                  name: "Single page Tutorial",
                  value: "simple",
                },
                {
                  name: "Multi page Tutorial",
                  value: "multipage"
                }
              ],
            })
          }
        }

        const template = new TemplateService(getTutorialFolder(proposalSlug));
        if (q.name === 'tutorial_file_creation_confirm') {
          ui.log.write('🚧 Creating tutorial folder...')
          await template.copy(q.answer);
          ui.log.write('🧱 Copying template folder...')
          await template.setName(proposalSlug);
          ui.log.write('🖌  Updating Slugs folder...')


          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug))
          config.db.data ||= await config.initial({
            proposalId: proposal.id,
            slug: proposal.slug,
          })

          const formatReviewer = (data: any) => ({
            pda: data.pda,
            pubkey: data.pubkey,
            githubName: data.githubName,
          })

          const reviewer1 = await client.getReviewerByReviewerAccountPDA(proposal.reviewer1).then(formatReviewer)
          ui.log.write(`🕵️‍♂️ Adding Reviewer ... ${reviewer1.githubName}`)
          const reviewer2 = await client.getReviewerByReviewerAccountPDA(proposal.reviewer2).then(formatReviewer)
          ui.log.write(`🧙‍♂️ Adding Reviewer ... ${reviewer2.githubName}`)

          config.db.chain.get('reviewers').push({ reviewer1 } as any, {reviewer2} as any).value()
          await updateHashDigestOfFolder(getTutorialFolder(proposalSlug))
          ui.log.write(`⛓ updating content folders`)

          await sleep(1000)
          await config.db.write();
          emitter.next({
            type: "input",
            name: "tutorial_title",
            message: "Tutorial title",
            default: proposalSlug,
          })
        }


        if (q.name === 'tutorial_title') {
          await sleep(1000)
          await template.setTitle(q.answer);
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug))
          config.db.chain.set('title', q.answer).value();
          await config.db.write();
          emitter.next({
            type: "input",
            name: "tutorial_description",
            message: "Tutorial Description",
          })
        }

        if (q.name === 'tutorial_description') {
          await template.setDescription(q.answer);
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug))
          config.db.chain.set('description', q.answer).value();
          await config.db.write();
          emitter.next({
            type: "input",
            name: "tutorial_tags",
            message: "Tags?  Commo seperated.",
          })
        }

        if (q.name === 'tutorial_tags') {
          await template.setDescription(q.answer);
          const config = new BuilderDaoConfig(getTutorialFolder(proposalSlug))
          config.db.chain.set('description', q.answer).value();
          await config.db.write();
          emitter.next({
            type: "confirm",
            name: "stage_changes",
            message: "Stage changes",
          })
        }

        if (q.name === 'stage_changes') {
          if (q.answer) {
            ui.log.write('Staging changes');
            await git.add('./*')
            console.log(await (await git.status()).staged)
            ui.log.write('Adding Commit');
            await git.commit(`🚀 ${proposalSlug} Tutorial Initial`);
            emitter.next({
              type: "confirm",
              name: "push_changes",
              message: "Push Changes",
            })
          } else {
            emitter.complete()
          }
          
        }

        if (q.name === 'push_changes') {
          if (q.answer) {
            await git.push(['-u', 'origin', `tutorials/${proposalSlug}`])
            ui.log.write(
              `🧱 [${proposalSlug}] Tutorial Initialized`
            )
          }
          emitter.complete()
        }
      })
    })
  return tutorial;
}
