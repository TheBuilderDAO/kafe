export * from './wrapper';
import { Image } from '../image';
import { CustomLink } from './custom-link';
import { WhatsNextSection } from './whats-next';

export const MDXComponents = {
  Image,
  a: CustomLink,
  WhatsNextSection,
};
