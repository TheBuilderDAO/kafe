import * as anchor from '@project-serum/anchor';
import * as commander from 'commander';
import { encode } from 'bs58';
import fs from "mz/fs"

const loadKeypairJson = (path: string) =>
  anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        fs.readFileSync(path, {
          encoding: 'utf8',
        }),
      ),
    ),
  );

const helpText = `
Example call:
$ builderdao admin bs58 --path <path_of_keypair.json>
`;

export const AdminBs58Command = () => {
  const bs58 = new commander.Command('bs58');

  bs58
    .description('helper')
    .helpOption('-h, --help', 'helper')
    .addHelpText(
      'after',
      helpText
    )
    .addOption(
      new commander.Option(
        '--path <path>',
        'keypair json file',
      ).makeOptionMandatory(),
    )
    .action(async options => {
      const keypair = loadKeypairJson(options.path);
      console.log(encode(keypair.secretKey));
    });

  return bs58;
}