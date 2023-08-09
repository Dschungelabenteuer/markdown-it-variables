import mardownIt from 'markdown-it';

import type { PluginOptions } from '../src/types';
import { variablesPlugin } from '../src';
import { createHtmlTag } from '../src/utils';

export const exampleClass = 'sampleclass';

/**
 * Sets up the plugin with test options and render the given input.
 * @param options Plugin options.
 * @param input Source input to render (and therefore apply the rule to).
 */
export function render(options: PluginOptions, input: string) {
  const md = mardownIt().use(variablesPlugin, options);
  return md.render(input);
}

export const htmlBlocks = {
  p: (content: string) => `${createHtmlTag({ content, tagName: 'p' })}\n`,
  span: (content: string, className?: string) =>
    `${createHtmlTag({
      content,
      tagName: 'span',
      attributes: className ? { class: className } : undefined,
    })}\n`,
  pre: (content: string) => `${createHtmlTag({ content, tagName: 'pre' })}\n`,
  strong: (content: string) => `${createHtmlTag({ content, tagName: 'strong' })}`,
  code: (content: string, language?: string) =>
    language ? `<code class="language-${language}">${content}\n</code>` : `<code>${content}</code>`,
};

export const mdWrappers = {
  codeInline: (content: string) => `\`${content}\``,
  codeBlock: (content: string, language: string) => `\`\`\`${language}\n${content}\n\`\`\``,
};

export const simpleData = {
  simple: 'my simple value',
  rich: {
    url: 'https://github.com',
    abbr: 'GH',
    label: 'GitHub',
  },
  richWithoutShort: {
    label: 'Rich Without Short',
    url: 'https://www.youtube.com/watch?v=378f9Tx5BYM',
  },
  richWithoutLink: {
    label: 'Rich Without Link',
    abbr: 'EWU',
  },
};

export const advancedData = {
  since: '1948',
  who: {
    url: 'https://www.who.int',
    abbr: 'WHO',
    label: 'World Health Organization',
  },
};
