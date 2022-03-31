import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import { getClient } from '../client';
import { log as _log } from '../utils';

export function makeReviewerCommand() {
  const reviewer = new commander.Command('reviewer')
    .addHelpCommand(false)
    .description('Display information about Kafé Reviewers')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (object: any) => _log(object, reviewer.optsWithGlobals().key);

  const client = getClient({
    kafePk: reviewer.optsWithGlobals().kafePk,
    network: reviewer.optsWithGlobals().network,
    payer: reviewer.optsWithGlobals().payer,
  });

  reviewer
    .command('list')
    .description('List all authorized Kafé Reviewer accounts')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao reviewer list

Notes:
  - This command displays the entire list of authorized Reviewers, their PublicKeys, number of assignments and GitHub usernames.
      `,
    )
    .action(async () => {
      const reviewers = await client.getReviewers();
      log(reviewers);
    });

  reviewer
    .command('get')
    .description(
      'Display a Kafé Reviewer account from their Solana PublicKey or GitHub account',
    )
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao reviewer get -p B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv

Notes:
  - Shortened PublicKeys of Reviewers are displayed on the Kafé interface.
      `,
    )
    .option(
      '-p, --publicKey <publicKey>',
      'Solana PublicKey of the Reviewer',
      val => new anchor.web3.PublicKey(val),
    )
    .option('-l, --login <githubLogin>', 'GitHub login of the Reviewer')
    .action(async options => {
      if (!Object.values(options).some(v => v)) {
        reviewer
          .showHelpAfterError(
            '💡 Use `builderdao reviewer get --help` for additional information',
          )
          .error('You must provide at least one option for fetching, -p or -l');
      }
      if (options.publicKey) {
        log(await client.getReviewerByReviewerPk(options.publicKey));
      } else if (options.login) {
        log(await client.getReviewerByGithubLogin(options.login));
      }
    });

  return reviewer;
}
