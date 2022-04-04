/* eslint-disable no-console */
import * as commander from 'commander';
import { log as _log } from '../utils';
import { getClient } from '../client';
import _ from 'lodash';
import { TutorialListCommand } from './tutorial/list';


export function makeTutorialCommand() {
  const tutorial = new commander.Command('tutorial')
    .addHelpCommand(false)
    .description('Initialize & publish Kafé tutorials')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });


  tutorial.addCommand(TutorialListCommand());

  return tutorial;
}
