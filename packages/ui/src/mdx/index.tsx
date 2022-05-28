export * from './wrapper';
import { Image } from '../image';
import Code from './Code';
import { CustomLink } from './custom-link';
import { Hint } from './hint';
import { WhatsNextSection } from './whats-next';

export const MDXComponents = {
  img: (props: any) => <Image {...props} />,
  a: CustomLink,
  WhatsNextSection,
};

export const getMDXComponents = (extra: any) => {
  return {
    img: (props: any) => <Image {...props} {...extra} />,
    a: CustomLink,
    WhatsNextSection,
    Hint,
    pre: Code,
  };
};
