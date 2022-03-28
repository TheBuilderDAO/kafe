import { visit } from 'unist-util-visit';
export const remarkTOC =
  ({ data, anchors, toc = [] }) =>
  tree => {
    const anchors = [];
    visit(tree, 'section', section => {
      let text = [];
      section.children.forEach(child => {
        visit(child, 'paragraph', paragraph => {
          visit(paragraph, 'text', textNode => {
            text.push(textNode.value);
          });
        });
      });

      anchors.push({
        title: data.title,
        section: section.data.hProperties.title,
        permalink: `#${section.data.hProperties.id}`,
        content: text.join('\n'),
      });
      toc.push({
        id: section.data.hProperties.id,
        title: section.data.hProperties.title,
        href: `#${section.data.hProperties.id}`,
        depth: section.depth,
      });
    });
    return tree;
  };
