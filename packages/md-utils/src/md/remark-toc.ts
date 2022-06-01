import { Children } from 'react';
import { visit } from 'unist-util-visit';

export const remarkTOC =
  ({ data, anchors, toc = [] }: { data: any; anchors: any[]; toc: any[] }) =>
  (tree: any) => {
    // console.log(JSON.stringify(tree, null, 2))
    visit(tree, 'section', section => {
      let text: any = [];
      section.children.forEach((child: any) => {
        console.log(JSON.stringify(child, null, 2));
        transformSectionToSearchIndex(section, data, anchors);
        // console.log(child)
        // visit(child, 'paragraph', paragraph => {
        //   visit(paragraph, 'text', textNode => {
        //     text.push(textNode.value);
        //   });
        // });
        // visit(child, 'paragraph', paragraph => {
        //   visit(paragraph, 'text', textNode => {
        //     text.push(textNode.value);
        //   });
        // });
      });

      // anchors.push({
      //   h1: '',
      //   h2: '',
      //   h3: '',
      //   importance: 0,
      //   objectID: `${data.lock.href}#${section.data.hProperties.id}`,
      //   title: data.config.title,
      //   section: section.data.hProperties.title,
      //   permalink: `/${data.lock.href}#${section.data.hProperties.id}`,
      //   content: text.join('\n'),
      //   parentID: data.lock.proposalId,
      //   parentName: data.config.title,
      //   tags: [...data.config.categories, ...data.frontMatter.keywords],
      // });
      toc.push({
        id: section.data.hProperties.id,
        title: section.data.hProperties.title,
        href: `#${section.data.hProperties.id}`,
        depth: section.depth,
      });
    });
    return tree;
  };

const getTitle = (heading: any) => {
  while (true) {
    if (heading.children) {
      visit(heading, 'text', textNode => {
        return textNode.value;
      });
    }
    break;
  }
};

const transformSectionToSearchIndex = (
  section: any,
  data: any,
  anchors: any[],
) => {
  visit(section, 'heading', heading => {
    console.log(heading);
    anchors.push({
      h1: data.config.title,
      h2: getTitle(heading),
    });
  });
  visit(section, 'paragraph', paragraph => {
    // visit(paragraph, 'text', textNode => {
    //   text.push(textNode.value);
    // });
  });
};
