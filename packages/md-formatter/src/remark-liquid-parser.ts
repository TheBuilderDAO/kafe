import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

const getChildren = (matches: string[], text: string): string | null => {
  if (matches.length > 1) {
    const reg = /%}\n(.*)\n{%/g.exec(text)
    return reg?.[1] || null
  }
  return null
};

/**
 * Break the liquid tag into service name and options
 * @param {String=} tag
 * @returns {Object} service and options in an object
 */
const breakLiquidTag = (tag: string) => {
  // replace multiple spaces with just one space
  // eslint-disable-next-line no-param-reassign
  tag = tag.replace(/\s{2,}/g, " ");

  const pieces = tag.split(" ");
  const [, tagName, ...tagOptions] = pieces;

  // remove "%}"
  tagOptions.splice(tagOptions.length - 1, 1);

  return {
    tagName,
    tagOptions: tagOptions.map((option: string) => {
      let [key, ...rest] = option.split('=')
      if (key === 'style') { // breaks the react rendering.
        key = 'type'
      }
      const formatted = [key, ...rest].join('=')
      return formatted
    }).join(' '),
  };
};

export const remarkLiquidParser = (options = {}) => (tree) => {
  visit(tree, "paragraph", node => {
    // Grab the innerText of the paragraph node
    let text = toString(node);

    // Test paragraph if it includes a liquid tag format
    let exp = /{\%.*\%}/g;
    const matches = text.match(exp);

    // Only show embeds for liquid tags
    if (matches !== null) {
      const children = getChildren(matches, text);
      const tagDetails = breakLiquidTag(matches[0]); // only interested in the first match
      const { tagName, tagOptions } = tagDetails;

      let embed;
      switch (tagName) {
        case "sidenote":
          embed = `<SideNote \n ${tagOptions}/>`;
          break;
        case "label":
          // eslint-disable-next-line no-case-declarations
          const content = /{% label %}\n(.*)/g.exec(text)?.[1];
          embed = `<Label>\n  ${content}\n</Label>`;
          break;
        case "embed":
          embed = `<Embed\n  ${tagOptions} />`;
          break;
        case "hint":
          embed = `<Hint\n  ${tagOptions}>\n${children}\n</Hint>`;
          break;
        case "code":
          embed = `<Code\n  ${tagOptions}>`;
          break;
        case "endcode":
          embed = `</Code>`;
          break;
        default:
      }

      if (embed === undefined) return;
      node.type = "html";
      node.children = undefined;
      node.value = embed;
    }
  });
  return tree;
}