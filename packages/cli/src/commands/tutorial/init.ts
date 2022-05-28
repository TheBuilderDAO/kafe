import { PublicKey } from '@solana/web3.js';
import * as commander from 'commander';
import inquirer, { DistinctQuestion, Answers } from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import Rx from 'rxjs';
import simpleGit, { CleanOptions } from 'simple-git';
import path from 'path';
import fs from 'fs-extra'

import { protocols, technologies } from '@builderdao/data';
import { filterProposalByState, ProposalStateE, filterProposalBySlug } from '@builderdao/program-tutorial';
import { TutorialMetadata, CeramicApi } from '@builderdao/apis';

import { getClient } from 'src/client';
import { TemplateService, BuilderDaoConfig } from 'src/services';
import { log as _log } from 'src/utils';

import { getReviewer } from '../reviewer';
import { updateHashDigestOfFolder } from './shared';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export const TutorialInitCommand = () => {
  const tutorialInit = new commander.Command('init');
  const log = (object: any) => _log(object, tutorialInit.optsWithGlobals().key);

  const client = getClient({
    kafePk: tutorialInit.optsWithGlobals().kafePk,
    network: tutorialInit.optsWithGlobals().network,
    payer: tutorialInit.optsWithGlobals().payer,
  });

  tutorialInit
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

      const git = simpleGit().clean(CleanOptions.DRY_RUN);
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
          ui.log.write('🚧 Updating slugs folder...');

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
          const tags = q.answer;
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

  tutorialInit
  return tutorialInit;
}
