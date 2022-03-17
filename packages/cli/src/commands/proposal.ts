import * as commander from 'commander'
import * as anchor from '@project-serum/anchor'
import { ProposalStateE } from '@builderdao-sdk/dao-program'

import { getClient } from '../client'
import { log as _log, createKeypairFromSecretKey } from '../utils'

function myParseInt(value: string) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10)
  if (Number.isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.')
  }
  return parsedValue
}

export function makeProposalCommand() {
  const proposal = new commander.Command('proposal').description(
    'Proposal Account',
  )
  const log = (object: any) => _log(object, proposal.optsWithGlobals().key)
  let client = getClient({
    kafePk: proposal.optsWithGlobals().kafePk,
    network: proposal.optsWithGlobals().network,
    payer: proposal.optsWithGlobals().payer,
  })

  proposal.command('list').action(async () => {
    const proposals = await client.getProposals()
    log(proposals)
  })

  proposal
    .command('setstate')
    .description('Set the state of a proposal')
    .argument('<proposalId>', 'Proposal ID', val => myParseInt(val))
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
          network: proposal.optsWithGlobals().network,
          payer: options.adminKp,
        })
        const txId = await client.proposalSetState({
          adminPk: options.adminKp.publicKey,
          id: proposalId,
          newState: options.state,
        })
        log({ txId })
      },
    )

  proposal
    .command('get')
    .description('Fetch Proposal')
    .option('-s, --slug <slug>', 'slug of the proposal')
    .option('-i, --id <id>', 'id of the proposal')
    .option('-p, --publicKey <publicKey>', 'PublicKey of the proposal')
    .action(async options => {
      if (!Object.values(options).some(v => v)) {
        proposal
          .showHelpAfterError('(add --help for additional information)')
          .error(
            'You need to provide atleast one option for fetching, -i or -s',
          )
      }

      if (options.slug) {
        log(await client.getTutorialBySlug(options.slug))
      } else if (options.id) {
        log(await client.getTutorialById(options.id))
      } else if (options.publicKey) {
        log(
          await client.tutorialProgram.account.proposalAccount.fetch(
            options.publicKey,
          ),
        )
      }
    })

  return proposal
}
