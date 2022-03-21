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
var import_unified = require("unified");
var import_remark_parse = __toESM(require("remark-parse"), 1);
var import_remark_stringify = __toESM(require("remark-stringify"), 1);
var import_fs_extra = __toESM(require("fs-extra"), 1);
var import_path = __toESM(require("path"), 1);
var import_chalk = __toESM(require("chalk"), 1);
var import_diff = require("diff");

// src/remark-liquid-parser.ts
var import_unist_util_visit = require("unist-util-visit");
var import_mdast_util_to_string = require("mdast-util-to-string");
var getChildren = (matches, text) => {
  if (matches.length > 1) {
    const reg = /%}\n(.*)\n{%/g.exec(text);
    return (reg == null ? void 0 : reg[1]) || null;
  }
  return null;
};
var breakLiquidTag = (tag) => {
  tag = tag.replace(/\s{2,}/g, " ");
  const pieces = tag.split(" ");
  const [, tagName, ...tagOptions] = pieces;
  tagOptions.splice(tagOptions.length - 1, 1);
  return {
    tagName,
    tagOptions: tagOptions.join(" ")
  };
};
var remarkLiquidParser = (options = {}) => (tree) => {
  (0, import_unist_util_visit.visit)(tree, "paragraph", (node) => {
    var _a;
    let text = (0, import_mdast_util_to_string.toString)(node);
    let exp = /{\%.*\%}/g;
    const matches = text.match(exp);
    if (matches !== null) {
      const children = getChildren(matches, text);
      const tagDetails = breakLiquidTag(matches[0]);
      const { tagName, tagOptions } = tagDetails;
      let embed;
      switch (tagName) {
        case "sidenote":
          embed = `<SideNote 
 ${tagOptions}/>`;
          break;
        case "label":
          const content = (_a = /{% label %}\n(.*)/g.exec(text)) == null ? void 0 : _a[1];
          embed = `<Label>
  ${content}
</Label>`;
          break;
        case "embed":
          embed = `<Embed
  ${tagOptions} />`;
          break;
        case "hint":
          embed = `<Hint
  ${tagOptions}>
${children}
</Hint>`;
          break;
        case "code":
          embed = `<Code
  ${tagOptions}>`;
          break;
        case "endcode":
          embed = `</Code>`;
          break;
        default:
      }
      if (embed === void 0)
        return;
      node.type = "html";
      node.children = void 0;
      node.value = embed;
    }
  });
  return tree;
};

// src/cli.ts
var getFile = async (pathForFile) => {
  const source = await import_fs_extra.default.readFile(pathForFile, "utf8");
  return source;
};
main();
async function main() {
  const source = await getFile(import_path.default.join(process.cwd(), "./kitchen/sink.md"));
  const destinationDir = import_path.default.join(process.cwd(), "faucet");
  const file = await (0, import_unified.unified)().use(import_remark_parse.default).use(import_remark_stringify.default).use(remarkLiquidParser).process(source);
  (0, import_diff.diffLines)(source, String(file)).forEach((part) => {
    if (part.added) {
      console.log(import_chalk.default.green(part.value));
    } else if (part.removed) {
      console.log(import_chalk.default.red(part.value));
    } else {
      console.log(import_chalk.default.grey(part.value));
    }
  });
}
