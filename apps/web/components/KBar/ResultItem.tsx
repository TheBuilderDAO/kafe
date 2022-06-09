import CodeBlock from '@builderdao/ui/src/mdx/Code/CodeBlock';
import { ActionImpl } from 'kbar';
import React from 'react';
import tw from 'tailwind-styled-components';
import { HitResult } from './useFullTextSearch';

export const ResultItem = React.forwardRef<
  {},
  { action: ActionImpl & { hit?: HitResult }; active: boolean }
>(({ action, active }, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      className={`flex flex-row justify-between p-2 ${
        active && 'bg-kafegold bg-opacity-20 rounded'
      }`}
      ref={ref}
    >
      <Action>
        <div className="p-1 flex items-start justify-center min-w-[3rem]">
          {action.icon && action.icon}
        </div>
        <ActionRow>
          <span className="dark:text-kafelighter ">{action.name}</span>
          {action?.hit?.type === 'code' && (
            <ActionCodeResult hit={action.hit} />
          )}
          {action?.hit?.type === 'paragraph' && (
            <ActionParagraphResult hit={action.hit} />
          )}
        </ActionRow>
      </Action>
      {action.shortcut?.length ? (
        <Shortcut aria-hidden>
          {action.shortcut.map(shortcut => (
            <Kbd key={shortcut}>{shortcut}</Kbd>
          ))}
        </Shortcut>
      ) : null}
    </div>
  );
});
ResultItem.displayName = 'ResultItem';

const formatHighlight = (rawString: string) =>
  rawString.replace('ais-highlight-0000000000', 'em');

const ActionCodeResult = ({ hit }) => {
  const findTheLinesHasHighlight = (content, matchedWords: string[]) => {
    const lines = [];
    content.split('\n').map((line, index) => {
      if (matchedWords.some(word => line.includes(word))) {
        lines.push(index + 1);
      }
    });
    return lines.length > 0 ? `{${lines.join(',')}}` : '';
  };
  return (
    <figure className="relative flex box-content w-full">
      <CodeBlock
        codeString={hit.content}
        language={hit.lang}
        metastring={findTheLinesHasHighlight(
          hit.content,
          hit._highlightResult.content.matchedWords,
        )}
      ></CodeBlock>
    </figure>
  );
};
const ActionParagraphResult = ({ hit }) => {
  return (
    <div className="flex flex-col text-kafemellow algolia-highlight">
      <p
        dangerouslySetInnerHTML={{
          __html: formatHighlight(hit._snippetResult.content.value),
        }}
      />
    </div>
  );
};

const Action = tw('div')`
flex gap-2 items-center text-kafelighter dark:text-kafemellow
`;

const ActionRow = tw('div')`
flex flex-col 
`;

const Shortcut = tw('div')`
  grid grid-cols-2 gap-2 grid-reverse col-end-auto 
`;

const Kbd = tw('kbd')`
  uppercase bg-opacity-30 bg-white py-1 px-2 rounded
`;
