import * as commander from 'commander';

import { getTutorialPaths } from '@builderdao/md-utils';

import { rootTutorialFolderPath } from 'src/constants';
import { log as _log } from 'src/utils';

const helpText = `
Example call:
$ builderdao tutorial list
`;

export const TutorialListCommand = () => {
  const tutorialList = new commander.Command('list');

  const log = (object: any) => _log(object, tutorialList.optsWithGlobals().key);

  tutorialList
    .description('List all tutorials and metadata')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      helpText
    )
    .action(async () => {
      const { allTutorials } = await getTutorialPaths(rootTutorialFolderPath);
      log(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allTutorials.reduce((prev: any, curr) => {
          // eslint-disable-next-line no-param-reassign
          prev[curr.slug] = curr;
          return prev;
        }, {}),
      );
    });

  return tutorialList;
}