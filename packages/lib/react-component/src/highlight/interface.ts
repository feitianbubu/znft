export const languageMap = {
  mdx: 'markdown',
  bash: 'bash',
  javascript: 'javascript',
  typescript: 'typescript',
  json: 'json',
  css: 'css',
  yaml: 'yaml',
  markdown: 'markdown',
  md: 'md',
  jsx: 'jsx',
  tsx: 'tsx',
} as const;

export interface HighlightProps {
  language?: keyof typeof languageMap;
  children:string|string[]
}
