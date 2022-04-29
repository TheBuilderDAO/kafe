# The airdop command

The following guide shows you how to send $KAFE and $BDR tokens to alpha testnet users.

<aside>
  🚨 Please confirm with @Daniel Gamboa before sending tokens to non-Figment
  addresses.
</aside>

## Prerequisites

- You must be an admin on Kafé.
- You must use your Solana account registered as an admin.

## Instructions

1. Open the terminal on your local machine.
2. Go to the directory where you plan to keep a local version of the Kafe repo.
3. Clone the repository locally by running the following:

   ```text
   gh repo clone TheBuilderDAO/kafe
   cd kafe
   ```

4. Build the CLI tool:

   ```text
   yarn install
   yarn build:client
   ```

5. Confirm that you’re linked to the right `builderdao` cli tool by running the following:

   ```text
   cd packages/cli
   yarn unlink
   ```

6. You should now have access to the `builderdao` cli tool. In order to test this, you can run `builderdao -h` → this will show some brief documentation, options and commands.
7. In order to send tokens, we will need the `admin` command. This command has three sub-commands that you can see by running `builderdao admin -h`:

   ```text
   builderdao admin --help

   Usage: builderdao admin [options] [command]

   admin command

   Options:
   -h, --help display help for command

   Commands:
   airdrop [options] Airdrop token to user
   bs58 [options] helper
   setAuthor [options] set the author of a migrated tutorial from LV2
   ```

8. Intuitively, we can use the airdrop command to send tokens. Before we do that, we can use the `builderdao admin airdrop -h` command to see what options we need to pass for the command to execute:

   ```text
   builderdao admin airdrop --help
   Usage: builderdao admin airdrop [options]

   Airdrop token to user

   Options:
   --adminKp <adminKp> Admin KeyPair (bs58 encoded) (env: ADMIN_KP)
   --address <address> address of the receiver
   --onlyKafe Airdrop only Kafe Token
   --onlyBDR Airdrop only BDR Token
   -h, --help display help for command

   Aidrop info:

   - 1 Kafe Token
   - 100 BDR Token (frozen)

   Example call to airdrop both Kafe and BDR token:
   $ builderdao airdrop --adminKp <bs58Secret> --address <bs58Pubkey>

   Example call to airdrop only BDR token:
   $ builderdao airdrop --adminKp <bs58Secret> --address <bs58Pubkey> --onlyBDR

   Example call to airdrop only Kafe token:
   $ builderdao airdrop --adminKp <bs58Secret> --address <bs58Pubkey> --onlyKafe
   ```

9. Here we see that we need to pass a public address for the account we want to send tokens using the option `--address`. Moreover, we need to pass a private key using the `--adminKp` option to authenticate ourselves as an admin. We also see that we have the option to send 1 $KAFE and 100 $BDR at the same time, or to choose one to send by itself.

10. In order to send tokens, you will need the base58 private key of the account you provided to be included as an admin. If you’re using Phantom wallet, follow these steps:

    1. Open the Settings by clicking on the gear on the bottom right of the wallet navigation bar.
    2. Scroll to the bottom of Settings and click on the button labeled “Export Private Key”.
    3. Enter your Phantom wallet password.
    4. Copy the private key (it should go without saying, but please keep this safe, make sure no one is looking at your screen, etc).

11. With your private key in your clipboard, go back to your terminal and issue the following command:

    ```markdown
    builderdao admin airdrop --adminKp <paste-your-private-key-here>
    --address <paste-destination-public-address-here>\*\*
    ✔ signature: <some-signature-hash-if-the-transaction-was-successful>
    ```

12. If the transaction fails, it will show an error and give a reason at the top of the error message along with a longer error message that you can safely ignore. If this happens, check your private key. And if you can’t resolve it, please contact @Daniel Gamboa or @Moises Beltran.
