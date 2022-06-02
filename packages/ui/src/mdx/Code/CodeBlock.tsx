import styled from 'styled-components';
import Highlight, { Prism, defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/dracula';
import { CodeBlockProps, HighlightedCodeTextProps } from './types';
import { calculateLinesToHighlight, hasTitle } from './utils';
import tw from 'tailwind-styled-components';
// @ts-ignore
import CopyToClipboardButton from '../../CopyToClipboardButton';
(typeof global !== 'undefined' ? global : window).Prism = Prism;

/**
 * This imports the syntax highlighting style for the solidity & rust language
 */
require('prismjs/components/prism-solidity');
require('prismjs/components/prism-rust');

export const HighlightedCodeText = (props: HighlightedCodeTextProps) => {
  const { title, codeString, language, highlightLine } = props;

  return (
    <Highlight
      {...defaultProps}
      theme={dracula}
      code={codeString}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre title={title} className={className} style={style}>
          {tokens.map((line, index) => {
            const { className: lineClassName } = getLineProps({
              className:
                highlightLine && highlightLine(index) ? 'highlight-line' : '',
              key: index,
              line,
            });

            return (
              <Line
                data-testid={
                  highlightLine && highlightLine(index)
                    ? 'highlight-line'
                    : 'line'
                }
                key={index}
                className={lineClassName}
              >
                <LineNo data-testid="number-line">{index + 1}</LineNo>
                <LineContent>
                  {line.map((token, key) => {
                    return (
                      <span
                        data-testid="content-line"
                        key={key}
                        {...getTokenProps({
                          key,
                          token,
                        })}
                      />
                    );
                  })}
                </LineContent>
              </Line>
            );
          })}
        </Pre>
      )}
    </Highlight>
  );
};

const CodeBlock = (props: CodeBlockProps) => {
  const { codeString, language, metastring } = props;

  const highlightLineFn = calculateLinesToHighlight(metastring);
  const title = hasTitle(metastring);

  return (
    <CodeSnippetWrapper>
      {/* {title ? ( */}
      <CodeSnippetHeader>
        <CodeSnippetTitle data-testid="codesnippet-title">
          {title}
        </CodeSnippetTitle>
        <CopyToClipboardButton title={title} text={codeString} />
      </CodeSnippetHeader>
      {/* // ) : null} */}
      <HighlightedCodeText
        title={title}
        codeString={codeString}
        language={language}
        highlightLine={highlightLineFn}
      />
    </CodeSnippetWrapper>
  );
};

export default CodeBlock;

const Pre = tw(styled('pre')<{ title?: string }>`
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  overflow: auto;

  ${p =>
    p.title
      ? ''
      : `
      border-top-left-radius: border-2;
      border-top-right-radius: border-2;
    `}
`)`border-b border-none`;

const Line = styled('div')`
  display: table;
  border-collapse: collapse;
  border-left: 3px solid transparent;
  &.highlight-line {
    border-left-width: 4px;
    border-color: rgb(255 255 255);
    background-color: #5686f51a;
  }

  &:hover {
    background-color: #5686f51a;
  }
`;

const LineNo = styled('div')`
  width: 30px;
  padding: 0 6px;
  user-select: none;
  opacity: 1;
  color: #575f75;
`;

const LineContent = styled('span')`
  display: table-cell;
  width: 100%;
`;

const CodeSnippetTitle = tw(styled('p')`
  font-size: 14px;
  margin-bottom: 0px;
`)`font-mono font-bold text-kafeblack dark:text-kafewhite`;

const CodeSnippetHeader = tw(styled('div')`
  @media (max-width: 500px) {
    border-radius: 0px;
    padding: 0px 8px;
  }

  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  margin-top: 0; important!;
`)`px-2  dark:border-[#2b303b] flex flex-center py-1 not-prose`;

const CodeSnippetWrapper = tw(styled('div')`
  @media (max-width: 750px) {
    /**
     * Make it fullbleed!
     */
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    border-radius: 0px;
  }
  margin-bottom: 32px;
`)`border shadow rounded-lg bg-[#e2e4e988] dark:bg-[#21242c80] dark:border-[#2b303b] px-1 py-1 relative max-w-2xl`;
