import type { RichVariable, RichVariableMap, VariableKey, VariableModifier } from '../types';
import type { PluginContext } from '../context';
import { createHtmlTag, isObject } from '../utils';
import Errors from '../errors';

type HasModifier = (modifiers: VariableModifier[]) => boolean;
const hasAbbrModifier: HasModifier = (m) => m.includes('abbr') || m.includes('-');
const hasLinkModifier: HasModifier = (m) => m.includes('link') || m.includes('#');

/**
 * Determines whether a given variable is a rich variable.
 * @param variable Resolved variable from registered list.
 */
export function isRich(variable: unknown): variable is RichVariable {
  return isObject(variable) && variable.hasOwnProperty('label');
}

/**
 * Returns the label of a rich variable.
 * @param key Key which identifies the variable.
 * @param variable Resolved rich variable from registered list.
 * @param modifiers List of requested modifiers to apply to the variable.
 * @param context Context of the plugin.
 */
export function getRichLabel(
  key: VariableKey,
  variable: RichVariableMap,
  modifiers: VariableModifier[],
  context: PluginContext,
): string {
  const label = variable.get('label')!;

  if (hasAbbrModifier(modifiers)) {
    const abbr = variable.get('abbr');

    if (!abbr) {
      // Warn user about the missing `abbr`.
      context.raise(new Errors.MissingAbbreviationError(key));
      // And fallback to `label` when not throwing.
      return label;
    }

    return createHtmlTag({
      tagName: 'abbr',
      content: abbr,
      attributes: {
        title: label,
      },
    });
  }

  return label;
}

/**
 * Returns a formatter function which creates blocks based on modifiers.
 * @param key Key which identifies the variable.
 * @param variable Resolved rich variable from registered list.
 * @param modifiers List of requested modifiers to apply to the variable.
 * @param context Context of the plugin.
 */
export function getRichFormatter(
  key: VariableKey,
  variable: RichVariableMap,
  modifiers: VariableModifier[],
  context: PluginContext,
): (label: string) => string {
  return (label: string) => {
    let output = label;

    if (hasLinkModifier(modifiers)) {
      const href = variable.get('url');
      if (href) {
        output = createHtmlTag({
          tagName: 'a',
          content: output,
          attributes: {
            href,
          },
        });
      } else {
        context.raise(new Errors.MissingUrlError(key));
      }
    }

    return output;
  };
}

/**
 * Returns the content of a rich variable.
 * @param key Key which identifies the variable.
 * @param variable Resolved rich variable from registered list.
 * @param modifiers List of requested modifiers to apply to the variable.
 * @param context Context of the plugin.
 */
export function getRichContent(
  key: VariableKey,
  variable: RichVariableMap,
  modifiers: VariableModifier[],
  context: PluginContext,
): string {
  const label = getRichLabel(key, variable, modifiers, context);
  const formatter = getRichFormatter(key, variable, modifiers, context);
  return formatter(label);
}
