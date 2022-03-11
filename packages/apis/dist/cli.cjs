#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/cli.ts
var commander3 = __toESM(require("commander"), 1);
var anchor4 = __toESM(require("@project-serum/anchor"), 1);
var bs582 = __toESM(require("bs58"), 1);
var import_dao_program3 = require("@builderdao-sdk/dao-program");

// src/commands/proposal.ts
var commander = __toESM(require("commander"), 1);
var import_dao_program2 = require("@builderdao-sdk/dao-program");

// src/client.ts
var anchor = __toESM(require("@project-serum/anchor"), 1);
var import_dao_program = require("@builderdao-sdk/dao-program");
var getClient = ({
  payer,
  network = import_dao_program.TutorialProgramConfig.Network.TESTNET,
  kafePk = new anchor.web3.PublicKey("KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW")
}) => {
  const connection = new anchor.web3.Connection(import_dao_program.TutorialProgramConfig.getClusterUrl(network), "confirmed");
  const wallet = new anchor.Wallet(payer);
  return new import_dao_program.TutorialProgramClient(connection, wallet, kafePk);
};

// src/utils.ts
var import_lodash = require("lodash");
var import_prettyjson = __toESM(require("prettyjson"), 1);
var anchor2 = __toESM(require("@project-serum/anchor"), 1);
var bs58 = __toESM(require("bs58"), 1);
var import_web3 = require("@solana/web3.js");
function stringifyPublicKeys(obj) {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const val = obj[keys[i]];
    if (val == null ? void 0 : val.toBuffer) {
      (0, import_lodash.set)(result, keys[i], val.toString());
    } else if (val instanceof Object && Object.keys.length > 0 && !Array.isArray(val)) {
      (0, import_lodash.set)(result, keys[i], stringifyPublicKeys(val));
    } else {
      (0, import_lodash.set)(result, keys[i], val);
    }
  }
  return result;
}
var log = (object, key = void 0) => {
  if (key) {
    console.log(stringifyPublicKeys({ [key]: (0, import_lodash.get)(object, key) })[key]);
  } else {
    console.log(import_prettyjson.default.render(stringifyPublicKeys(object)));
  }
};
var createKeypairFromSecretKey = (secretKey) => {
  const array = Uint8Array.from(bs58.decode(secretKey));
  return anchor2.web3.Keypair.fromSecretKey(array);
};

// src/commands/proposal.ts
function myParseInt(value) {
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}
function makeProposalCommand() {
  const proposal = new commander.Command("proposal").description("Proposal Account");
  const log2 = (object) => log(object, proposal.optsWithGlobals().key);
  let client = getClient({
    kafePk: proposal.optsWithGlobals().kafePk,
    network: proposal.optsWithGlobals().network,
    payer: proposal.optsWithGlobals().payer
  });
  proposal.command("list").action(async () => {
    const proposals = await client.getProposals();
    log2(proposals);
  });
  proposal.command("setstate").description("Set the state of a proposal").argument("<proposalId>", "Proposal ID", (val) => myParseInt(val)).addOption(new commander.Option("-s, --state <state>", "State of the proposal").choices(Object.keys(import_dao_program2.ProposalStateE)).makeOptionMandatory()).addOption(new commander.Option("-a, --adminKp <adminKp>", "Admin KeyPair (bs58 encoded)").argParser((val) => createKeypairFromSecretKey(val)).env("ADMIN_KP").makeOptionMandatory()).action(async (proposalId, options) => {
    client = getClient({
      kafePk: proposal.optsWithGlobals().kafePk,
      network: proposal.optsWithGlobals().network,
      payer: options.adminKp
    });
    const txId = await client.proposalSetState({
      adminPk: options.adminKp.publicKey,
      id: proposalId,
      newState: options.state
    });
    log2({ txId });
  });
  proposal.command("get").description("Fetch Proposal").option("-s, --slug <slug>", "slug of the proposal").option("-i, --id <id>", "id of the proposal").option("-p, --publicKey <publicKey>", "PublicKey of the proposal").action(async (options) => {
    if (!Object.values(options).some((v) => v)) {
      proposal.showHelpAfterError("(add --help for additional information)").error("You need to provide atleast one option for fetching, -i or -s");
    }
    if (options.slug) {
      log2(await client.getTutorialBySlug(options.slug));
    } else if (options.id) {
      log2(await client.getTutorialById(options.id));
    } else if (options.publicKey) {
      log2(await client.tutorialProgram.account.proposalAccount.fetch(options.publicKey));
    }
  });
  return proposal;
}

// src/commands/reviewer.ts
var commander2 = __toESM(require("commander"), 1);
var anchor3 = __toESM(require("@project-serum/anchor"), 1);
function makeReviewerCommand() {
  const reviewer = new commander2.Command("reviewer").description("Reviewer Account");
  const log2 = (object) => log(object, reviewer.optsWithGlobals().key);
  const client = getClient({
    kafePk: reviewer.optsWithGlobals().kafePk,
    network: reviewer.optsWithGlobals().network,
    payer: reviewer.optsWithGlobals().payer
  });
  reviewer.command("list").action(async () => {
    const reviewers = await client.getReviewers();
    log2(reviewers);
  });
  reviewer.command("get").option("-p, --publicKey <publicKey>", "PublicKey of the reviewer", (val) => new anchor3.web3.PublicKey(val)).option("-l, --login <githubLogin>", "github login of the reviewer").action(async (options) => {
    if (!Object.values(options).some((v) => v)) {
      reviewer.showHelpAfterError("(add --help for additional information)").error("You need to provide atleast one option for fetching, -p or -l");
    }
    if (options.publicKey) {
      log2(await client.getReviewer(options.publicKey));
    } else if (options.login) {
      log2(await client.getReviewerByGithubLogin(options.login));
    }
  });
  return reviewer;
}

// src/cli.ts
var program = new commander3.Command();
program.name("builderdao").description(`
\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2557\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D
\u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D 
                                                                               
CLI to interact with BuilderDAO programs.
    `).version("0.0.1");
program.option("-k --key <key>", "get key from the result");
program.addOption(new commander3.Option("--kafePk <kafePk>", "Kafe Token PublicKey").default(new anchor4.web3.PublicKey("KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW").toString()));
program.addOption(new commander3.Option("--payer <payer>", "Keypair to sign trasactions").default(bs582.encode(new anchor4.web3.Keypair().secretKey)).argParser((val) => createKeypairFromSecretKey(val)));
program.addOption(new commander3.Option("--network <network>", "Solana Network").default(import_dao_program3.TutorialProgramConfig.Network.TESTNET).choices(Object.values(import_dao_program3.TutorialProgramConfig.Network)));
program.addCommand(makeProposalCommand());
program.addCommand(makeReviewerCommand());
program.showSuggestionAfterError();
program.parseAsync(process.argv);
