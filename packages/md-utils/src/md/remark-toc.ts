import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';

export const remarkTOC =
  ({ data, anchors, toc = [] }: { data: any; anchors: any[]; toc: any[] }) =>
  (tree: any) => {
    visit(tree, 'section', section => {
      let text: any = [];
      section.children.forEach((child: any) => {
        visit(child, 'code', code => {
          // text.push(code.value);
        });
        // const file = toHtml(child)
        // console.log('asdads', file)
        visit(child, 'paragraph', paragraph => {
          visit(paragraph, 'text', textNode => {
            text.push(textNode.value);
          });
        });
      });

      anchors.push({
        objectID: `${data.lock.href}#${section.data.hProperties.id}`,
        title: data.config.title,
        section: section.data.hProperties.title,
        permalink: `/${data.lock.href}#${section.data.hProperties.id}`,
        content: text.join('\n'),
        parentID: data.lock.proposalId,
        parentName: data.config.title,
        tags: [...data.config.categories, ...data.frontMatter.keywords],
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
