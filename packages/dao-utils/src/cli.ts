#!/usr/bin/env node
import * as commander from 'commander';

import { makePostBuildCommand } from './commands/postBuild';

const program = new commander.Command();
program
  .name('dao-sdk-util')
  .description(
    'CLI to populate artifacts of Anchor programs for crosponding network',
  )
  .version('0.0.1');

program.addCommand(makePostBuildCommand());
program.showSuggestionAfterError();
program.parse(process.argv);
