import * as commander from 'commander';
import path from 'path';
import {
  getTutorialPaths,
  getTutorialContentByPath,
  getTutorialContentByPackageName,
} from '@builderdao/md-utils';

import { log as _log, hashSumDigest } from '../utils';
import { BuilderDaoConfig } from '../services/builderdao-config.service';
import _ from 'lodash';

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
      const { db } = new BuilderDaoConfig(rootFolder)
      await db.read()
      // const content = db.data?.content || {}
      // for (const file of tutorialMetadata.content) {
      await db.read()
      tutorialMetadata.content.forEach(async file => {
        const digest = await hashSumDigest(file.path);
        const relativePath = path.relative(rootFolder,file.path);
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
    .argument('[learnPackageName]', 'Tutorial name')
    .action(async (learnPackageName) => {
      const rootFolder = learnPackageName
        ? path.join(rootFolderPath, learnPackageName)
        : process.cwd();


      // const config = new BuilderDaoConfig(rootFolder)
    })


  return tutorial;
}
