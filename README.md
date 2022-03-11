# Builder DAO.

Builder DAO monorepo.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps, Packages, Tutorials, and Solana Programs.

- apps:
  - `web`: BuilderDAO frontend
    - `/learn/<tutorial-name>/<md-file-name>`Renders tutorials.
    - `/proposal/<proposal-publickey>`Renders proposals. (TODO)
- packages:
  - `ui`: a stub React component library shared by both `web` and `docs` applications
  - `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
  - `tsconfig`: `tsconfig.json`s used throughout the monorepo
  - `md-utils`: utilities for parsing markdown files
- tutorials:
  - `<tutorial-name>`
    - `/builderdao.config.js`: configuration for the tutorial
    - `/content/<md-file>`: tutorial content
- programs:
  - `<solana-program-name>`: a solana program
    - `/src`: rust source code for the program
    - `/ts`: SDK source code
    - `/tests/`: rust test code for the program
    - `/__tests__`: typescript tests for the program

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```

## How to use?

[] TODO:
If you are writing new UI component it's need to be added to `ui` package.
