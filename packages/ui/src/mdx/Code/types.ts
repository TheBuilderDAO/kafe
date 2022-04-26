import { Language } from 'prism-react-renderer';

export type PrePropsType = {
  props: {
    live?: boolean;
    render?: boolean;
  };
  children: {
    props: {
      metastring: string;
      mdxType?: string;
      type?: string;
      className?: string;
      children: string;
    };
  };
};

export interface CodeSnippetWrapperProps {
  fullWidth?: boolean;
}

export interface CodeBlockProps {
  codeString: string;
  language: Language;
  metastring: string | null;
  live?: boolean;
  render?: boolean;
}

export interface HighlightedCodeTextProps {
  title?: string;
  codeString: string;
  language: Language;
  highlightLine?: (index: number) => boolean;
}
