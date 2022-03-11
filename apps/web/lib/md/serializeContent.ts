import { serialize } from 'next-mdx-remote/serialize';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import remarkSlug from 'remark-slug';
import { remarkSectionize } from './remark-sectionize-fork';
import remarkImgToJsx from './remark-img-to-jsx';
export const serializeContent = async ({
  content,
  data,
}: {
  content: string;
  data: any;
}) => {
  return await serialize(content, {
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
      ],
    },
  });
};
