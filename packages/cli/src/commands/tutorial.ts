import { BuilderDaoConfig } from './../services/builderdao-config.service';
import * as commander from 'commander';
import path from 'path';
import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';

import { log as _log, hashSumDigest } from '../utils';

export function makeTutorialCommand() {
  const rootFolderPath = path.join(
    __dirname,
    '../../../',
    'node_modules',
    '@builderdao-learn',
  );
  const tutorial = new commander.Command('tutorial').description('Tutorial');
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
      const config = new BuilderDaoConfig(rootFolder)
      for (const file of tutorialMetadata.content) {
        const digest = await hashSumDigest(file.path);
        config.db.chain.set(`content.${file.name}`, digest).value();
      }
      await config.write();
    });

  tutorial.command('init')
    .argument('[learnPackageName]', 'Tutorial name')
    .action(async (learnPackageName) => {
      const rootFolder = learnPackageName
        ? path.join(rootFolderPath, learnPackageName)
        : process.cwd();

      const config = new BuilderDaoConfig(rootFolder)
      config.initial()
    })


  return tutorial;
}
