// import { visit } from 'unist-util-visit';
// export const remarkTOC =
//   ({ data, anchors, toc = [] }) =>
//   tree => {
//     visit(tree, 'section', section => {
//       let text = [];
//       section.children.forEach(child => {
//         visit(child, 'paragraph', paragraph => {
//           visit(paragraph, 'text', textNode => {
//             text.push(textNode.value);
//           });
//         });
//       });
//       console.log({ data });
//       anchors.push({
//         title: data.title,
//         section: section.data.hProperties.title,
//         permalink: `${data.url}#${section.data.hProperties.id}`,
//         content: text.join('\n'),
//       });
//       toc.push({
//         id: section.data.hProperties.id,
//         title: section.data.hProperties.title,
//         href: `#${section.data.hProperties.id}`,
//         depth: section.depth,
//       });
//     });
//     return tree;
//   };

import { SectionContainer } from '@builderdao/ui';
import { chown } from 'fs';
import { head } from 'lodash';
import { Children } from 'react';
import { visit } from 'unist-util-visit';
import visitParents from 'unist-util-visit-parents';

export const remarkTOC =
  ({ data, anchors, toc = [] }: { data: any; anchors: any[]; toc: any[] }) =>
  (tree: any) => {
    // console.log(JSON.stringify(tree, null, 2))
    visit(tree, 'section', section => {
      let text: any = [];
      section.children.forEach((child: any) => {
        // console.log(JSON.stringify(child, null, 2))
        if (section.depth > 2) return;
        //   visitParents(
        //     tree,
        //     (node: any) =>
        //       node.type === 'section' &&
        //       node.depth === 2 &&
        //       node.children.find(child => child.type === 'section' && child.data.hProperties.title === section.data.hProperties.title),
        //     (node, ancestors) => {
        //       console.log("#".repeat(30))
        //       console.log("@".repeat(30))
        //       console.log(section.data.hProperties.title)
        //       console.log("=".repeat(30))
        //       console.log(node.data.hProperties.title)
        //       console.log("@".repeat(30))
        //       // console.log(ancestors.filter(a => a.type === 'section').map(a => a.data.hProperties.title))
        //       console.log("#".repeat(30))
        //     },
        //   );
        // }
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

const getTitle = (heading: any, depth = 2) => {
  let title = null;
  if (heading.depth === depth) {
    visit(heading, 'text', textNode => {
      title = textNode.value;
    });
  }
  return title;
};

const transformSectionToSearchIndex = (
  section: any,
  data: any,
  anchors: any[],
  parent = {},
) => {
  const paragraphs = [];
  const headings = [];
  const codes = [];
  // if (parent) {
  //   console.log(parent.data.hProperties.title)
  // }
  const anchor = {
    h1: data.config.title,
    ...parent,
    [`h${section.depth}`]: section.data.hProperties.title,
  };
  // if (parent) {
  //   anchor[`h${parent.data.hProperties.depth}`] = getTitle(section, parent.data.hProperties.depth);
  // }
  // {

  //   h1: data.config.title,
  //   // section: JSON.stringify(section),
  //   // headings,
  //   // paragraphs,
  // }

  anchors.push(anchor);
  section.children
    .filter(child => child.type === 'section')
    .forEach(child =>
      transformSectionToSearchIndex(child, data, anchors, anchor),
    );

  section.children
    .filter(child => child.type === 'paragraph')
    .forEach(paragraph => {
      anchors.push({
        ...anchor,
        content: paragraph.children.map(child => child.value).join('\n'),
      });
    });
  anchors.push({
    blank: '+'.repeat(20),
  });
  // visit(section,
  //   (node) => {
  //     console.log('node', node)
  //     return node.type === 'paragraph'
  //   },
  //   paragraph => {
  //     // console.log(heading)
  //   })

  // visit(section, 'paragraph', paragraph => {
  //   paragraphs.push({
  //     h1: data.config.title,
  //     // h2: getTitle(heading),
  //     content: paragraph.children.map(child => child.value).join('\n'),
  //   })
  // });
};
