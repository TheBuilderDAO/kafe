import { getTutorialContentByPackageName } from '@builderdao/md-utils';
import * as commander from 'commander';

import { rootTutorialFolderPath } from 'src/constants';
import { log as _log } from 'src/utils';

const helpText = `
Example call:
$ builderdao tutorial get near-101
`;

export const TutorialGetCommand = () => {
  const tutorialGet = new commander.Command('get');

  const log = (object: any) => _log(object, tutorialGet.optsWithGlobals().key);

  tutorialGet
    .description('Display metadata for a single tutorial')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      helpText
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
  return tutorialGet;
}