import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import { getClient } from '../client';
import { log as _log } from '../utils';

export function makeReviewerCommand() {
  const reviewer = new commander.Command('reviewer').description(
    'Reviewer Account',
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (object: any) => _log(object, reviewer.optsWithGlobals().key);
  const client = getClient({
    kafePk: reviewer.optsWithGlobals().kafePk,
    network: reviewer.optsWithGlobals().network,
    payer: reviewer.optsWithGlobals().payer,
  });

  reviewer.command('list').action(async () => {
    const reviewers = await client.getReviewers();
    log(reviewers);
  });

  reviewer
    .command('get')
    .option(
      '-p, --publicKey <publicKey>',
      'PublicKey of the reviewer',
      val => new anchor.web3.PublicKey(val),
    )
    .option('-l, --login <githubLogin>', 'github login of the reviewer')
    .action(async options => {
      if (!Object.values(options).some(v => v)) {
        reviewer
          .showHelpAfterError('(add --help for additional information)')
          .error(
            'You need to provide atleast one option for fetching, -p or -l',
          );
      }
      if (options.publicKey) {
        log(await client.getReviewerByReviewerAccountPDA(options.publicKey));
      } else if (options.login) {
        log(await client.getReviewerByGithubLogin(options.login));
      }
    });

  return reviewer;
}
