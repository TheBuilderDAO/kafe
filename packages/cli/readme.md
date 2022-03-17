# BuilderDAO CLI

## Usage

```bash
Usage: builderdao [options] [command]
██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗ ██████╗  █████╗  ██████╗
██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔═══██╗
██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝██║  ██║███████║██║   ██║
██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗██║  ██║██╔══██║██║   ██║
██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║██████╔╝██║  ██║╚██████╔╝
╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝

CLI to interact with BuilderDAO programs.

Options:
  -V, --version   output the version number
  -k --key <key>  get key from the result
  --kafePk <kafePk>    Kafe Token PublicKey (default: "KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW")
  --network <network>  Solana Network (choices: "mainnet-beta", "devnet", "testnet", "localnet", default: "testnet")
  --payer <payer>      Keypair to sign trasactions (default: "4QGkjyQdXVtewXqMvnSkuNStx8nMS7E98aqxt4qW8HkfG5WGNLcjGJV9eVj9QQyej7GaZHwnzLheysmLy7GsrpwQ")
  -h, --help      display help for command

Commands:
  proposal        Proposal Account
  reviewer        Reviewer Account
  help [command]  display help for command
```

## Proposal Account

```bash
Usage: builderdao proposal [options] [command]

Proposal Account

Options:
  -h, --help      display help for command
  -k --key <key>  get key from the result

Commands:
  list
  setstate        Set the state of a proposal
  get [options]   Fetch Proposal
  help [command]  display help for command
```

### List Proposals

```bash
$ builderdao proposal list
0:
  publicKey: 6rbAj2N4sJQsWifKrRnJAE2BcwFtea1gQCFzz9534f1L
  account:
    id:            1
    bump:          255
    creator:       Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy
    reviewer1:     FdW4ieKucCXZy1i8hMdaJ5ztTwrFBnXVKmFBjVufToRe
    reviewer2:     BQfAioQkL1P6yb9jsgjbXN5LraTDdTNzoNgSTXatYnBM
    numberOfVoter: 1
    createdAt:     1646224528
    state:
      writing:
    slug:          near-101
    streamId:      kjzl6cwe1jw145wg457n52vguustdhrk4k5gb2btvcmekczc3is9wrcst9b3fdr
1:
  publicKey: E1XY2b1AZQyzudmhHmhZ8aB6zEjSdULBEoNG5GFYRkJb
  account:
    id:            2
    bump:          253
    creator:       Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy
    reviewer1:     11111111111111111111111111111111
    reviewer2:     11111111111111111111111111111111
    numberOfVoter: 0
    createdAt:     1646256488
    state:
      submitted:
    slug:          celo-101
    streamId:      kjzl6cwe1jw149di4kvrcsie2t8uit9lm2gf8j6al0pwf33hbws98q9imscsyvl
...
```

### Get Proposal

```bash
Usage: builderdao proposal get [options]

Fetch Proposal

Options:
  -s, --slug <slug>            slug of the proposal
  -i, --id <id>                id of the proposal
  -p, --publicKey <publicKey>  PublicKey of the proposal
  -h, --help                   display help for command
```

#### via Slug

```
$builderdao proposal get -s near-101
id:            1
bump:          255
creator:       Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy
reviewer1:     FdW4ieKucCXZy1i8hMdaJ5ztTwrFBnXVKmFBjVufToRe
reviewer2:     BQfAioQkL1P6yb9jsgjbXN5LraTDdTNzoNgSTXatYnBM
numberOfVoter: 1
createdAt:     1646224528
state:
  writing:
slug:          near-101
streamId:      kjzl6cwe1jw145wg457n52vguustdhrk4k5gb2btvcmekczc3is9wrcst9b3fdr

```

#### via ID

```bash
$ builderdao proposal get -i 2
id:            2
bump:          253
creator:       Ea43t5noyJAMLHpux9TfaTFv6wKsLnVqyDmJ87qtUCmy
reviewer1:     11111111111111111111111111111111
reviewer2:     11111111111111111111111111111111
numberOfVoter: 0
createdAt:     1646256488
state:
  submitted:
slug:          celo-101
streamId:      kjzl6cwe1jw149di4kvrcsie2t8uit9lm2gf8j6al0pwf33hbws98q9imscsyvl
```

#### via PublicKey

```bash
$ builderdao proposal get -p DKxxioeChZDFnCb79bcfHj8DVnrpeBfRUSr7sg2vLpo4
id:            3
bump:          254
creator:       9c8oxENj8XrEM2EMadxUoifZgB1Vbc8GEYqKTxTfPo3i
reviewer1:     11111111111111111111111111111111
reviewer2:     11111111111111111111111111111111
numberOfVoter: 0
createdAt:     1646261917
state:
  submitted:
slug:          build-a-blog-dapp-using-the-anchor-framework
streamId:      kjzl6cwe1jw147lc9kvxwur5o3k1n1igbfb7hdbz8g3gntqbqoj6jperqsw3sil
```

#### set State of proposal

```bash
Usage: builderdao proposal setstate [options] <proposalId>

Set the state of a proposal

Arguments:
  proposalId               Proposal ID

Options:
  -s, --state <state>      State of the proposal (choices: "funded", "published", "readyToPublish", "submitted", "writing")
  -a, --adminKp <adminKp>  Admin KeyPair (env: ADMIN_KP)
  -h, --help               display help for command
```

```bash
ADMIN_KP=$ADMIN_KP builderdao proposal setstate 1 -state published
# or
builderdao proposal setstate 1 -state published -a $ADMIN_KP
```

## Reviewer Account

```bash
Usage: builderdao reviewer [options] [command]

Reviewer Account

Options:
  -h, --help      display help for command

Commands:
  list
  get [options]
  help [command]  display help for command
```

### List Reviewers.

```bash
$ builderdao reviewer list
0:
  publicKey: FdW4ieKucCXZy1i8hMdaJ5ztTwrFBnXVKmFBjVufToRe
  account:
    bump:               255
    pubkey:             HtdezEbemuLpAh9no1jp7Eezy8drWcbFuk3VPhs17bM4
    numberOfAssignment: 1
    githubName:         vunderkind
1:
  publicKey: BQfAioQkL1P6yb9jsgjbXN5LraTDdTNzoNgSTXatYnBM
  account:
    bump:               255
    pubkey:             9Gaovv3PatKvTLUDLLMqCj2CYaB4rAnXm4nziVfmjovT
    numberOfAssignment: 4
    githubName:         yash-sharma1
2:
  publicKey: 8XFt9LTf2vjiJB7UNEeu7vydJy5SNzcRRQ7EqMgRzqxF
  account:
    bump:               255
    pubkey:             B1auxYrvvhJW9Y5nE8ghZKzvX1SGZZUQTt9kALFR4uvv
    numberOfAssignment: 3
    githubName:         zurgl

```

### Get Reviewer by Github Login

```bash
  ➜ builderdao reviewer get -l Necmttn
bump:               255
pubkey:             8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU
numberOfAssignment: 0
githubName:         Necmttn
```

### Get Reviewer by PublicKey

```bash
  ➜ builderdao reviewer get -p 8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU
bump:               255
pubkey:             8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU
numberOfAssignment: 0
githubName:         Necmttn
```

## Accessing the key in result.

if you provide the flag `-k` or `--key`, the result will be accessed via `_.get(result, key)`

```
➜  builderdao reviewer get -p 8JDKJA3pW7xbxGKkRraZiQCd6nTF9MZtrBv6Ah8BNyvU -k githubName
Necmttn
```
