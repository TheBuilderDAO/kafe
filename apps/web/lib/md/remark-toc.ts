import { visit } from 'unist-util-visit';

export const remarkTOC =
  ({ data, anchors, toc = [] }: { data: any; anchors: any[]; toc: any[] }) =>
  (tree: any) => {
    visit(tree, 'section', section => {
      transformSectionToSearchIndex(section, data, anchors);
      toc.push({
        id: section.data.hProperties.id,
        title: section.data.hProperties.title,
        href: `#${section.data.hProperties.id}`,
        depth: section.depth,
      });
    });
    return tree;
  };

const transformSectionToSearchIndex = (
  section: any,
  data: any,
  anchors: any[],
  parent: any = null,
) => {
  const anchor = {
    h1: data.config.title,
    importance: 1,
    ...parent,
    permalink: `/${data.lock.href}#${section.data.hProperties.id}`,
    objectID: `${data.lock.href}#${section.data.hProperties.id}`,
    [`h${section.depth}`]: section.data.hProperties.title,
    type: 'heading',
    parentID: data.lock.proposalId,
    parentName: data.config.title,
  };

  if (parent?.importance) {
    anchor.importance = parent.importance + 1;
  }

  let paragraphCount = 1;
  anchors.push(anchor);
  section.children.forEach(child => {
    switch (child.type) {
      case 'section':
        transformSectionToSearchIndex(child, data, anchors, anchor);
        break;
      case 'paragraph': {
        const content = child.children.map(child => child.value).join('\n');
        if (content) {
          anchors.push({
            ...anchor,
            importance: anchor.importance + 3,
            objectID: `${anchor.objectID}-${paragraphCount}`,
            content: content,
            type: 'paragraph',
          });
          paragraphCount++;
        }
        break;
      }
      case 'code': {
        anchors.push({
          ...anchor,
          importance: anchor.importance + 5,
          objectID: `${anchor.objectID}-${paragraphCount}`,
          lang: child.lang,
          content: child.value,
          type: 'code',
        });
        paragraphCount++;
        break;
      }
    }
  });
};
