import * as commander from 'commander';
import path from 'path';

import { log as _log } from 'src/utils';
import { rootTutorialFolderPath } from 'src/constants';
import { BuilderDaoConfig } from 'src/services';
import { getClient } from 'src/client';

import { getReviewer } from 'src/commands/reviewer';
import { updateHashDigestOfFolder } from './shared';

const helpText = `
Example call:
$ builderdao tutorial prepublish near-101

Notes:
- The prepublish workflow deals with the builderdao-config.service to generate the 
builderdao config and lock files, also updating the hash digest of the tutorial folder.
`

export const TutorialPrepublishCommand = () => {
  const tutorialPrepublish = new commander.Command('prepublish');
  const log = (object: any) => _log(object, tutorialPrepublish.optsWithGlobals().key);

  const client = getClient({
    kafePk: tutorialPrepublish.optsWithGlobals().kafePk,
    network: tutorialPrepublish.optsWithGlobals().network,
    payer: tutorialPrepublish.optsWithGlobals().payer,
  });

  tutorialPrepublish
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
      helpText,
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

  return tutorialPrepublish;
}