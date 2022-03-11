## Installing dependencies

To get started, make sure to setup all the prerequisite tools on your local machine (an installer has not yet been developed).

### Install Rust

For an introduction to Rust, see the excellent [Rust book](https://doc.rust-lang.org/book/).

```rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup component add rustfmt
```

### Install Solana

See the solana [docs](https://docs.solana.com/cli/install-solana-cli-tools) for installation instructions. On macOS and Linux,

```
sh -c "$(curl -sSfL https://release.solana.com/v1.9.1/install)"
```

### Install Anchor using Anchor version manager (avm)

Anchor version manager is a tool for using multiple versions of the anchor-cli. It will require the same dependencies as building from source. It is recommended you uninstall the NPM package if you have it installed.

Install avm using Cargo. Note this will replace your anchor binary if you had one installed.

```
cargo install --git https://github.com/project-serum/anchor avm --locked --force
```

Install the latest version of the CLI using avm. You can also use the command to upgrade to the latest release in the future.

```
avm use latest
```

Verify the installation.

```
anchor --version
```

## Quick setup

Before testing ensure to do the following

```
solana config set --keypair ./wallet/dao-keypair.json
solana config set --url localhost
```

## Directory structure

The layout is the following for one program

```
programs/dao
├── src
│   ├── errors.rs
│   ├── instructions
│   │   ├── create.rs
│   │   ├── increment.rs
│   │   └── mod.rs
│   ├── lib.rs
│   ├── state
│   │   ├── counter.rs
│   │   └── mod.rs
│   └── utils
│       └── .gitkeep
├── Cargo.toml
└── Xargo.toml
```

Description:

- `src` contains the src
- `src/errors.rs` contains the program error
- `src/instruction` define the program instruction and handler
- `src/state` define the program state
- `src/utils` contains helper is needed
- `Cargo.toml` where rust dependencies are defined
