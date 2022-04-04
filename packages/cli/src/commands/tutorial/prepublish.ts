import * as commander from 'commander';
import path from 'path';

import { log as _log } from 'src/utils';
import { rootTutorialFolderPath } from 'src/constants';
import { BuilderDaoConfig } from 'src/services';
import { getClient } from 'src/client';

import { getReviewer } from 'src/commands/reviewer';
import { updateHashDigestOfFolder } from './shared';
import { CeramicApi } from '@builderdao/apis';
import _ from 'lodash';

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
      new commander.Option('--force', 'Force Rewrite the lock file base on slug').default(false)
    )
    .addOption(
      new commander.Option('--seed <seed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--nodeUrl <nodeUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
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
      if (options.force) {
        const proposal = await client.getTutorialBySlug(lock.chain.get('slug').value());
        lock.chain.set('proposalId', proposal.id.toNumber()).value();
        lock.chain.set('creator', proposal.creator).value();
        lock.write();
      }
      await lock.read()
      const proposal = await client.getTutorialBySlug(lock.chain.get('slug').value());
      const ceramic = new CeramicApi({
        nodeUrl: options.nodeUrl,
      });
      if (!options.seed) {
        throw Error('Ceramic seed is required');
      }
      ceramic.setSeed(options.seed);
      const proposalDetails = await ceramic.getMetadata(proposal.streamId);
      const { lock: lockDefault } = await BuilderDaoConfig.initial({
        proposalId: proposal.id.toNumber(),
        slug: proposal.slug as string,
      });
      await lock.read();
      lock.data ||= lockDefault;
      lock.chain.set('content', proposalDetails.content).value();
      await lock.write();
      lock.chain.set('proposalId', proposal.id.toNumber());
      const reviewer1 = await getReviewer(client, proposal.reviewer1);
      lock.chain.get('reviewers').set('reviewer1', reviewer1).value();
      const reviewer2 = await getReviewer(client, proposal.reviewer1);
      lock.chain.get('reviewers').set('reviewer2', reviewer2).value();
      await lock.write();
      await updateHashDigestOfFolder(rootFolder);
      await lock.read()
      log(lock.data);
    });

  return tutorialPrepublish;
}