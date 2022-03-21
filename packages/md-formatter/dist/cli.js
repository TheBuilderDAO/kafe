#!/usr/bin/env node

// src/cli.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { diffLines } from "diff";

// src/remark-liquid-parser.ts
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
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
  visit(tree, "paragraph", (node) => {
    var _a;
    let text = toString(node);
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
  const source = await fs.readFile(pathForFile, "utf8");
  return source;
};
main();
async function main() {
  const source = await getFile(path.join(process.cwd(), "./kitchen/sink.md"));
  const destinationDir = path.join(process.cwd(), "faucet");
  const file = await unified().use(remarkParse).use(remarkStringify).use(remarkLiquidParser).process(source);
  diffLines(source, String(file)).forEach((part) => {
    if (part.added) {
      console.log(chalk.green(part.value));
    } else if (part.removed) {
      console.log(chalk.red(part.value));
    } else {
      console.log(chalk.grey(part.value));
    }
  });
}
