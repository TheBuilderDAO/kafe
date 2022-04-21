import styled from 'styled-components';
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  AnimatePresence,
  AnimateSharedLayout,
} from 'framer-motion';
import { PrismTheme } from 'prism-react-renderer';
import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
// import Pill from '@theme/components/Pill'
import { CodeBlockProps, CodeSnippetWrapperProps } from './types';
import tw from 'tailwind-styled-components';

const LiveCodeBlock = (props: CodeBlockProps) => {
  const { codeString, live, render } = props;

  const scope = {
    motion,
    AnimatePresence,
    AnimateSharedLayout,
    useAnimation,
    useMotionValue,
    useTransform,
    styled,
    // Pill,
    React,
  };

  const customTheme = {
    styles: [],
    plain: {},
  } as PrismTheme;

  if (live) {
    return (
      <LiveProvider
        theme={customTheme}
        code={codeString}
        scope={scope}
        noInline={true}
      >
        <StyledLiveCodeWrapper>
          <StyledPreviewWrapper height={600} withEditor={true}>
            <LivePreview />
            <StyledErrorWrapper>
              <LiveError />
            </StyledErrorWrapper>
          </StyledPreviewWrapper>
          <StyledEditorWrapper>
            <LiveEditor />
          </StyledEditorWrapper>
        </StyledLiveCodeWrapper>
      </LiveProvider>
    );
  }

  if (render) {
    return (
      <LiveProvider code={codeString} scope={scope} noInline={true}>
        <StyledLiveCodeWrapper>
          <StyledPreviewWrapper>
            <LivePreview />
          </StyledPreviewWrapper>
        </StyledLiveCodeWrapper>
      </LiveProvider>
    );
  }

  return null;
};

const StyledLiveCodeWrapper = tw('div')<CodeSnippetWrapperProps>`
  position: relative;

  @media (max-width: 750px) {
    display: block;
  }

  @media (max-width: 1100px) {
    /**
     * Make it fullbleed! 
     */
    width: 100vw;

    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  @media (min-width: 1100px) {
    position: relative;
    width: calc(100% + 400px);
    margin: 0px -200px 32px -200px;
  }

  backdrop-filter: blur(6px);
  border rounded rounded-lg shadow
  display: flex;
  align-items: center;
`;

const StyledEditorWrapper = tw('div')`
  flex: 60 1 0%;
  height: 100%;
  max-height: 600px;
  overflow: auto;
  margin: 0;

  border shadow rounded-lg rounded-l-none bg-[#e2e4e933] dark:bg-[#21242c80] dark:border-[#2b303b]
  border-top-right-radius: border-2
  border-bottom-right-radius: border-2

  * > textarea:focus {
    outline: none;
  }
`;

const StyledPreviewWrapper = tw('div')<{
  height?: number;
  withEditor?: boolean;
}>`
  max-height: 600px;
  min-height: ${p => p.height || 300}px;
  flex: 40 1 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  bg-[#e2e4e988] rounded-lg rounded-r-none
  overflow: hidden;
  border-2
`;

const StyledErrorWrapper = styled('div')`
  color: var(--maximeheckel-colors-typeface-secondary);
  max-width: 300px;

  pre {
    padding: 15px;
    margin-bottom: 0px;
  }
`;

export default LiveCodeBlock;
