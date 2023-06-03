import type MarkdownIt from 'markdown-it';
import type Ruler from 'markdown-it/lib/ruler';

import type { PluginOptions, RuleFunction } from './types';
import { baseRendererName, baseRuleName } from './config';
import { createVariableRule } from './rule';

export type { PluginOptions };

export function variablesPlugin(md: MarkdownIt, options: PluginOptions) {
  const inlineRuler = md.inline.ruler as Ruler<RuleFunction>;
  md.renderer.rules[baseRendererName] = (tokens, idx) => tokens[idx].content;
  inlineRuler.push(baseRuleName, createVariableRule(md, options));
}
