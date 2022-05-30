// https://github.com/storybookjs/design-system/blob/2761341916a6f0071d02b552040f8c14b620f8be/src/components/Highlight.tsx
import * as React from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {HighlightProps} from './interface';
export const Highlight: React.FC<HighlightProps> = ({
  children,
  language: inputLanguage,
}) => {
  return (
    <SyntaxHighlighter language={inputLanguage||'javascript'} style={docco}>
      {children}
    </SyntaxHighlighter>
  );
};
export default Highlight;
