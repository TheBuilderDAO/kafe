# BuilderDAO CLI

A CLI to interact with BuilderDAO on-chain programs.

## Setup

Build the ESM and CJS modules with:

```text
yarn build:cli
```

## General Usage

Once it has been built, you can invoke the CLI from anywhere with `builderdao`.

- `builderdao -v` displays the current version of `builderdao`.

- `builderdao` or `builderdao <command>` will display extended help, for example `builderdao tutorial` will output:

```text
Usage: builderdao tutorial [options] [command]

Initialize & publish Kafé tutorials

Options:
  -h, --help                            display help for command

Commands:
  get <learnPackageName>                Display metadata for a single tutorial
  init [options]                        Initialize a tutorial package from a
                                        proposal
  list                                  List all tutorials and metadata
  prepublish [learnPackageName]         Perform pre-publishing tasks
  publish [options] [learnPackageName]  Publish tutorial to Arweave & Ceramic
```

- To see details about the options for any command, you can add the `-h` or `--help` option after the command, for example `builderdao tutorial prepublish --help` will output:

```text
Usage: builderdao tutorial prepublish [options] [learnPackageName]

Perform pre-publishing tasks

Arguments:
  learnPackageName  Tutorial slug for complete tutorial package

Options:
  -h, --help        Display help for command

Example call:
  $ builderdao tutorial prepublish near-101

Notes:
  - The prepublish workflow deals with the builderdao-config.service to generate the
  builderdao config and lock files, also updating the hash digest of the tutorial folder.
```

> Example calls start with the default prompt character $ - Remember that it is not part of the command!

## Basic options

- `--kafePk` can be used to specify the Kafé token public key, the default will be used if one is not provided.

- `--network` will default to Solana's testnet cluster if you do not specify another cluster. Only use localnet if you have a currently running [Solana Test Validator](https://docs.solana.com/developing/test-validator). Note that the default may change in the future when Kafé is deployed to mainnet.

- `--payer` can be used to specify a [base58 encoded](https://tools.ietf.org/id/draft-msporny-base58-01.html#alphabet) private key to sign any Solana transactions required by the CLI.

```text
Usage: builderdao [options] [command]

Options:
  -h, --help           Display help for command
  -k, --key <key>      Get key from the result
  --kafePk <kafePk>    Kafe Token PublicKey (default:
                       "KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW")
  --network <network>  Solana Network (choices: "mainnet-beta", "devnet",
                       "testnet", "localnet", default: "testnet")
  --payer <payer>      Base58-encoded private key to sign trasactions (default:
                       "4TbkzfQgj37cvwRuNFGmABUZ8aZrnSkym9kw22hNgP6Y1cTrENV53srxZxwgwZFN4LXELzBnN2v3q8DjsgjFJU5e")
  -v --version         Outputs version number
```

## Accessing the key in a result

If you provide the flag `-k` or `--key`, the result will be accessed via `_.get(result, key)`:

```text
$ builderdao reviewer get -p 8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU -k githubName

Output would be "Necmttn"
```

## Setting the state of a Proposal

Only Kafé Admins can alter the state of a proposal. The Keypair can be passed as an environment variable.

```text
ADMIN_KP=$ADMIN_KP builderdao proposal setstate 1 -state published
```

or

```text
builderdao proposal setstate 1 -state published -a $ADMIN_KP
```
