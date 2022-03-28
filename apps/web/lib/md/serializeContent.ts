import { serialize } from 'next-mdx-remote/serialize';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import remarkSlug from 'remark-slug';
import { remarkSectionize } from './remark-sectionize-fork';
import remarkImgToJsx from './remark-img-to-jsx';
import { remarkTOC } from './remark-toc';
export const serializeContent = async ({
  content,
  data,
}: {
  content: string;
  data: any;
}) => {
  const anchors = [];
  const toc = [];
  const mdxSource = await serialize(content, {
    scope: {
      data,
    },
    mdxOptions: {
      rehypePlugins: [],
      remarkPlugins: [
        remarkSlug,
        remarkSectionize,
        remarkImgToJsx,
        [
          remarkAutolinkHeadings,
          {
            behavior: 'wrap',
          },
        ],
        [
          remarkTOC,
          {
            data,
            anchors,
            toc,
          },
        ],
      ],
    },
  });

  return {
    mdxSource,
    anchors,
    toc,
  };
};
