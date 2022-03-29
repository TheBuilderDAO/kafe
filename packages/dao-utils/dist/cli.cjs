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
var commander2 = __toESM(require("commander"), 1);

// src/commands/postBuild.ts
var commander = __toESM(require("commander"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var defaultTargetFolder = import_path.default.resolve(import_path.default.join(process.cwd(), "../../target/"));
var targetTypesFolder = (targetFolder) => import_path.default.join(targetFolder, `/types`);
var targetIdlFolder = (targetFolder) => import_path.default.join(targetFolder, `/idl`);
var projectIdlFolder = () => {
  if (!import_fs.default.existsSync(import_path.default.join(process.cwd(), "/ts-sdk/lib/idl"))) {
    import_fs.default.mkdirSync("/ts-sdk/lib/idl");
  }
  return import_path.default.join(process.cwd(), "/ts-sdk/lib/idl");
};
var populateTypesFolder = (programName, targetFolder) => {
  const typeFile = import_path.default.join(targetTypesFolder(targetFolder), `${programName}.ts`);
  const programFolder = import_path.default.join(projectIdlFolder(), `${programName}.ts`);
  import_fs.default.copyFileSync(typeFile, programFolder);
};
var populateIdlJson = (programName, targetFolder) => {
  const idlFile = import_path.default.join(targetIdlFolder(targetFolder), `${programName}.json`);
  const programFolder = import_path.default.join(projectIdlFolder(), `${programName}.json`);
  import_fs.default.copyFileSync(idlFile, programFolder);
};
function makePostBuildCommand() {
  const postBuild = new commander.Command("postBuild").description("Copies the types file to the target folder").argument("<program name>", "program name").option("-t, --targetFolder <path>", "target folder path", defaultTargetFolder).action((programName, { targetFolder }) => {
    populateTypesFolder(programName, targetFolder);
    populateIdlJson(programName, targetFolder);
  });
  return postBuild;
}

// src/cli.ts
var program = new commander2.Command();
program.name("dao-sdk-util").description("CLI to populate artifacts of Anchor programs for crosponding network").version("0.0.1");
program.addCommand(makePostBuildCommand());
program.showSuggestionAfterError();
program.parse(process.argv);
