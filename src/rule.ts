import type MarkdownIt from 'markdown-it';

import type {
  Lexicon,
  PluginOptions,
  RuleFunction,
  VariableContent,
  VariableDeclarationParams,
} from './types';

import Errors, { handleError } from './errors';
import { PluginContext } from './context';
import { baseRendererName, modifierSeparator, ruleEndsWith, ruleStartsWith } from './config';
import { getSimpleContent, isSimple } from './variables/simple';
import { getRichContent } from './variables/rich';

/**
 * Parses the content of a delimited variable to extract the variable value
 * and requested modifiers.
 * @param content Raw variable content.
 * @param lexicon Registered lexicon.
 */
function parseVariableContent(content: VariableContent, lexicon: Lexicon) {
  const [key, ...modifiers] = content.split(modifierSeparator) as VariableDeclarationParams;
  const variable = lexicon.get(key);
  if (!variable) throw new Errors.UnknownVariableError(key);
  return { key, variable, modifiers };
}

/**
 * Replaces and returns the variable with the adequate content depending on its key,
 * wrapped by relevant markup depending on the potentially provided modifiers.
 * @param content Raw content of the variable.
 * @param context Context of the plugin.
 * @param className Base class name.
 * @note At this stage, all variables have already been validated when setting the
 * plugin's context. Any malformatted variables were already excluded from the lexicon
 * and the user warned about them, so we don't need to re-check variable types.
 */
function getVariableContent(
  content: VariableContent,
  context: PluginContext,
  className: PluginOptions['className'],
): string {
  try {
    const { key, variable, modifiers } = parseVariableContent(content, context.lexicon);
    return wrapClass(
      isSimple(variable)
        ? getSimpleContent(key, variable, modifiers, context)
        : getRichContent(key, variable, modifiers, context),
      className,
    );
  } catch (error: unknown) {
    return handleError(error, context, content);
  }
}

/**
 * Wraps the variable output in a span with specified class name (when specified).
 */
function wrapClass(content: string, className?: PluginOptions['className']) {
  return className ? `<span class="${className}">${content}</span>` : content;
}

/**
 * Returns the inline-rule ready to be pushed into Markdown-it's inline ruler.
 * @param md MarkdownIt's parser class.
 * @param options Options of the plugin.
 */
export function createVariableRule(md: MarkdownIt, options: PluginOptions) {
  const context = new PluginContext(options);
  const emptyData = context.lexicon.size === 0;
  if (emptyData) return () => false;

  const variableRule: RuleFunction = (state, silent) => {
    if (silent || !state.src.slice(state.pos).startsWith(ruleStartsWith)) return false;

    // We start from the first character within the rule delimiters.
    const start = state.pos + ruleStartsWith.length;

    // Then we move right until the end delimiter.
    let end = start + 1;
    while (end < state.src.length && state.src[end] !== ruleEndsWith) end += 1;

    // Create a token for the inline rule
    const token = state.push(baseRendererName, '', 0);
    const content = state.src.slice(start, end);
    token.content = getVariableContent(content, context, options.className);

    // Move right after the end delimiter to get rid of it.
    state.pos = end + ruleEndsWith.length;
    return true;
  };

  return variableRule;
}
