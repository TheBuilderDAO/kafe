import * as commander from 'commander';

import { TutorialGetCommand } from './get';
import { TutorialInitCommand } from './init';
import { TutorialListCommand } from './list';
import { TutorialPrepublishCommand } from './prepublish';
import { TutorialPublishCommand } from './publish';


export function makeTutorialCommand() {
  const tutorial = new commander.Command('tutorial')
    .addHelpCommand(false)
    .description('Initialize & publish Kafé tutorials')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });


  tutorial.addCommand(TutorialGetCommand());
  tutorial.addCommand(TutorialInitCommand());
  tutorial.addCommand(TutorialListCommand());
  tutorial.addCommand(TutorialPrepublishCommand());
  tutorial.addCommand(TutorialPublishCommand());

  return tutorial;
}
