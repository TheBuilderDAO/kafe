var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AlgoliaApi: () => AlgoliaApi_default,
  ArweaveApi: () => ArweaveApi_default,
  CeramicApi: () => CeramicApi_default,
  GitHubApi: () => GitHubApi_default,
  SolanaApi: () => SolanaApi_default
});

// src/AlgoliaApi.ts
var import_algoliasearch = __toESM(require("algoliasearch"), 1);
var AlgoliaApi = class {
  constructor(config) {
    this.client = (0, import_algoliasearch.default)(config.appId, config.accessKey);
    this.index = this.client.initIndex(config.indexName);
  }
  async createTutorial(record) {
    await this.index.saveObject(record).wait();
  }
  async updateNumberOfVotes(objectID, numberOfVotes) {
    await this.index.partialUpdateObject({
      objectID,
      numberOfVotes
    }).wait();
  }
  async publishTutorial(objectID, state) {
    await this.index.partialUpdateObject({
      objectID,
      state
    }).wait();
  }
};
var AlgoliaApi_default = AlgoliaApi;

// src/ArweaveApi.ts
var import_arweave = __toESM(require("arweave"), 1);
var _ArweaveApi = class {
  constructor(config) {
    this.appName = config.appName;
    this.wallet = JSON.parse(config.wallet);
    this.client = import_arweave.default.init({
      host: config.host || "localhost",
      port: config.port || 1984,
      protocol: config.protocol || "http"
    });
  }
  async publishTutorial(data, address) {
    const transaction = await this.client.createTransaction({ data }, this.wallet);
    transaction.addTag("App-Name", this.appName);
    transaction.addTag("Content-Type", "application/json");
    transaction.addTag("Address", address);
    await this.client.transactions.sign(transaction, this.wallet);
    await this.client.transactions.post(transaction);
    return transaction.id;
  }
  async getTutorialByHash(transactionHash) {
    const txDataResp = await this.client.transactions.getData(transactionHash, {
      decode: true,
      string: true
    });
    const txData = JSON.parse(txDataResp);
    const txStatusResp = await this.client.transactions.getStatus(transactionHash);
    const txStatus = txStatusResp.status === 200 && txStatusResp.confirmed && txStatusResp.confirmed.number_of_confirmations >= _ArweaveApi.ARWEAVE_REQUIRED_CONFIRMATIONS ? 1 /* CONFIRMED */ : 0 /* NOT_CONFIRMED */;
    if (txStatus === 1 /* CONFIRMED */) {
      const block = txStatusResp.confirmed ? await this.client.blocks.get(txStatusResp.confirmed.block_indep_hash) : null;
      const tx = await this.client.transactions.get(transactionHash);
      const tags = {};
      tx.get("tags").forEach((tag) => {
        const key = tag.get("name", {
          decode: true,
          string: true
        });
        tags[key] = tag.get("value", { decode: true, string: true });
      });
      return {
        id: transactionHash,
        data: txData,
        status: txStatus,
        timestamp: block == null ? void 0 : block.timestamp,
        tags
      };
    }
    return {
      id: transactionHash,
      data: txData,
      status: txStatus
    };
  }
};
var ArweaveApi = _ArweaveApi;
ArweaveApi.ARWEAVE_REQUIRED_CONFIRMATIONS = 2;
var ArweaveApi_default = ArweaveApi;

// src/CeramicApi.ts
var import_http_client = require("@ceramicnetwork/http-client");
var import_stream_tile = require("@ceramicnetwork/stream-tile");
var import_key_did_resolver = __toESM(require("key-did-resolver"), 1);
var import_dids = require("dids");
var import_key_did_provider_ed25519 = require("key-did-provider-ed25519");
var CeramicApi = class {
  constructor(config) {
    this.seed = config.seed;
    this.client = new import_http_client.CeramicClient(config.nodeUrl);
  }
  async ensureAppAuthenticated() {
    var _a;
    if (!((_a = this.client.did) == null ? void 0 : _a.authenticated)) {
      await this.authenticateApp();
    }
  }
  async authenticateApp() {
    if (!this.seed) {
      throw new Error("Seed not provided");
    }
    const resolver = __spreadValues({}, import_key_did_resolver.default.getResolver());
    this.client.did = new import_dids.DID({ resolver });
    const seed = new Uint8Array(this.seed.split(" ").map((i) => parseInt(i, 10)));
    const provider = new import_key_did_provider_ed25519.Ed25519Provider(seed);
    this.client.did.setProvider(provider);
    this.authenticatedDid = await this.client.did.authenticate();
    return this.authenticatedDid;
  }
  async getMetadata(streamId) {
    const doc = await import_stream_tile.TileDocument.load(this.client, streamId);
    return doc.content;
  }
  async storeMetadata(metadata) {
    await this.ensureAppAuthenticated();
    return import_stream_tile.TileDocument.create(this.client, metadata);
  }
  async updateMetadata(streamId, metadata) {
    await this.ensureAppAuthenticated();
    const doc = await import_stream_tile.TileDocument.load(this.client, streamId);
    return doc.update(metadata);
  }
};
var CeramicApi_default = CeramicApi;

// src/GitHubApi.ts
var import_axios = __toESM(require("axios"), 1);
var GitHubApi = class {
  constructor() {
    this.client = import_axios.default.create({
      baseURL: "https://api.github.com/",
      timeout: 1e3
    });
  }
  async triggerWorkflow(slug) {
    const owner = "";
    const repo = "";
    const workflowId = "publish.yaml";
    await this.client.post(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      inputs: {
        slug
      }
    });
  }
};
var GitHubApi_default = GitHubApi;

// src/SolanaApi.ts
var import_dao_program = require("@builderdao-sdk/dao-program");
var SolanaApi = class {
  constructor(config) {
    this.tutorialProgram = new import_dao_program.TutorialProgramClient(config.connection, config.wallet, config.kafeMint);
  }
};
var SolanaApi_default = SolanaApi;
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlgoliaApi,
  ArweaveApi,
  CeramicApi,
  GitHubApi,
  SolanaApi
});
