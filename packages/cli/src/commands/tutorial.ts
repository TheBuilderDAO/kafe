import * as commander from 'commander';
import { promises as fs } from 'fs';
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
      const content: { [filename: string]: string } = {};
      for (const file of tutorialMetadata.content) {
        const digest = await hashSumDigest(file.path);
        content[file.name] = digest;
      }

      const configFilePath = path.join(rootFolder, 'builderdao.config.json');
      tutorialMetadata.config.content = content;
      await fs.writeFile(
        configFilePath,
        JSON.stringify(tutorialMetadata.config, null, 2),
      );
    });

  return tutorial;
}
