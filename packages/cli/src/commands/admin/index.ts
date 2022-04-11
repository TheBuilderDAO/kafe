import * as commander from 'commander';

import { AdminAirdropCommand } from './airdrop';
import { AdminBs58Command } from './utils';
import { AdminSetAuthorCommand } from './setAuthor';

export function makeAdminCommand() {
  const admin = new commander.Command('admin')
    .addHelpCommand(false)
    .description('admin command')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  admin.addCommand(AdminAirdropCommand());
  admin.addCommand(AdminSetAuthorCommand());
  admin.addCommand(AdminBs58Command());

  return admin;
}