/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import { filterProposalByState, ProposalStateE } from '@builderdao/program-tutorial';
import { CeramicApi } from '@builderdao/apis';
import _ from 'lodash';

import { getClient } from '../client';
import { log as _log, createKeypairFromSecretKey } from '../utils';
import { BuilderDaoConfig } from '../services';

function myParseInt(value: string) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

export function makeProposalCommand() {
  const proposal = new commander.Command('proposal')
    .addHelpCommand(false)
    .description('Display information about Kafé Proposals')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (object: any) => _log(object, proposal.optsWithGlobals().key);

  let client = getClient({
    kafePk: proposal.optsWithGlobals().kafePk,
    bdrPk: proposal.optsWithGlobals().bdrPk,
    network: proposal.optsWithGlobals().network,
    payer: proposal.optsWithGlobals().payer,
  });

  proposal
    .command('list')
    .description('List all authorized Kafé proposals')
    .helpOption('-h, --help', 'Display help for command')
    .action(async () => {
      const proposals = await client.getProposals();
      log(proposals);
    });

  proposal
    .command('publish')
    .argument('[proposalId]', 'Proposal ID', val => myParseInt(val))
    .addOption(
      new commander.Option(
        '-a, --adminKp <adminKp>',
        'Admin KeyPair (bs58 encoded)',
      )
        .argParser(val => createKeypairFromSecretKey(val))
        .env('ADMIN_KP')
        .makeOptionMandatory(),
    )
    .action(
      async (
        proposalId: number,
        options: {
          adminKp: anchor.web3.Keypair;
          state: ProposalStateE;
        },
      ) => {
        client = getClient({
          kafePk: proposal.optsWithGlobals().kafePk,
          bdrPk: proposal.optsWithGlobals().bdrPk,
          network: proposal.optsWithGlobals().network,
          payer: options.adminKp,
        });
        let tutorialId: number;
        if (!proposalId) {
          const rootFolder = process.cwd();
          const { lock } = new BuilderDaoConfig(rootFolder);
          await lock.read()
          tutorialId = lock.chain.get('proposalId').value();
        } else {
          tutorialId = proposalId;
        }

        const tutorial = await client.getTutorialById(tutorialId);
        const txId = await client.proposalPublish({
          authorPk: tutorial.creator,
          adminPk: options.adminKp.publicKey,
          id: tutorial.id.toNumber(),
        });
        log({ txId });
      });


  proposal
    .command('setstate')
    .description('Set the state of a proposal')
    .argument('[proposalId]', 'Proposal ID', val => myParseInt(val))
    .addOption(
      new commander.Option('-s, --state <state>', 'State of the proposal')
        .choices(Object.keys(ProposalStateE))
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '-a, --adminKp <adminKp>',
        'Admin KeyPair (bs58 encoded)',
      )
        .argParser(val => createKeypairFromSecretKey(val))
        .env('ADMIN_KP')
        .makeOptionMandatory(),
    )
    .action(
      async (
        proposalId: number,
        options: {
          adminKp: anchor.web3.Keypair;
          state: ProposalStateE;
        },
      ) => {
        client = getClient({
          kafePk: proposal.optsWithGlobals().kafePk,
          bdrPk: proposal.optsWithGlobals().bdrPk,
          network: proposal.optsWithGlobals().network,
          payer: options.adminKp,
        });
        let tutorialId: number;
        if (!proposalId) {
          const rootFolder = process.cwd();
          const { lock } = new BuilderDaoConfig(rootFolder);
          await lock.read()
          tutorialId = lock.chain.get('proposalId').value();
        } else {
          tutorialId = proposalId;
        }

        const tutorial = await client.getTutorialById(tutorialId);
        const txId = await client.proposalSetState({
          adminPk: options.adminKp.publicKey,
          id: tutorial.id.toNumber(),
          newState: options.state,
        });
        log({ txId });
      },
    );

  proposal
    .command('setQuorum')
    .description('Set the Quorum of all proposal')
    .argument('[quorum]', 'Quorum', val => myParseInt(val))
    .addOption(
      new commander.Option(
        '-a, --adminKp <adminKp>',
        'Admin KeyPair (bs58 encoded)',
      )
        .argParser(val => createKeypairFromSecretKey(val))
        .env('ADMIN_KP')
        .makeOptionMandatory(),
    )
    .action(
      async (
        quorum: number,
        options: {
          adminKp: anchor.web3.Keypair;
        },
      ) => {
        client = getClient({
          kafePk: proposal.optsWithGlobals().kafePk,
          bdrPk: proposal.optsWithGlobals().bdrPk,
          network: proposal.optsWithGlobals().network,
          payer: options.adminKp,
        });

        const currentQuorum = (await client.getDaoAccount()).quorum.toNumber();
        if (currentQuorum <= quorum) {
          return
        }

        const proposalsToUpdate = (
          await client.getProposals([
            filterProposalByState(ProposalStateE.submitted),
          ])
        ).filter(data => data.account.numberOfVoter.toNumber() >= quorum).map(data => data.account);

        for (const proposalData of proposalsToUpdate) {
          const txId = await client.proposalSetState({
            adminPk: options.adminKp.publicKey,
            id: proposalData.id.toNumber(),
            newState: ProposalStateE.funded,
          });
          log({ txId });
        }

        const sgn = await client.daoSetQuorum({
          adminPk: options.adminKp.publicKey,
          quorum,
        });
        log({ sgn });
      },
    );

  proposal
    .command('get')
    .description('Fetch details of a Kafé Proposal')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ builderdao proposal get -p DKxxioeChZDFnCb79bcfHj8DVnrpeBfRUSr7sg2vLpo4

Notes:
  - PublicKeys of proposals are not currently displayed anywhere on the Kafé interface.
      `,
    )
    .option('-s, --slug <slug>', 'Slug of the proposal')
    .option('-i, --id <id>', 'ID of the proposal')
    .option('-p, --publicKey <publicKey>', 'PublicKey of the proposal')
    .addOption(
      new commander.Option('--nodeUrl <nodeUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--skip-ceramic', 'Skip Ceramic').default(false)
    )
    .action(async options => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let proposal: any;
      if (options.slug) {
        proposal = await client.getTutorialBySlug(options.slug)
      } else if (options.id) {
        proposal = await client.getTutorialById(options.id)
      } else if (options.publicKey) {
        proposal = await client.tutorialProgram.account.proposalAccount.fetch(
          options.publicKey,
        )
      } else {
        const rootFolder = process.cwd();
        const { lock } = new BuilderDaoConfig(rootFolder);
        await lock.read()
        const proposalId = lock.chain.get('proposalId').value();
        // eslint-disable-next-line no-param-reassign
        options.id = proposalId;
        proposal = await client.getTutorialById(proposalId)
      }
      if (!options.skipCeramic) {
        const ceramic = new CeramicApi({
          nodeUrl: options.nodeUrl,
        });
        const proposalDetails = await ceramic.getMetadata(proposal.streamId);
        proposal = _.merge(proposal, proposalDetails);
      }
      log(proposal);


      if (!Object.values(options).some(v => v)) {
        proposal
          .showHelpAfterError(
            '💡 Use `builderdao proposal get --help` for additional information',
          )
          .error('You must provide at least one option for fetching, -i or -s');
      }

    });

  return proposal;
}
