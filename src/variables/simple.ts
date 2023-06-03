import type { SimpleVariable, VariableKey, VariableModifier } from '../types';
import type { PluginContext } from '../context';
import Errors from '../errors';

/**
 * Determines whether a given variable is a simple variable.
 * @param variable Resolved variable from registered list.
 */
export function isSimple(variable: unknown): variable is SimpleVariable {
  return typeof variable === 'string';
}

/**
 * Returns the content of a simple variable.
 * @param key Key which identifies the variable.
 * @param variable Resolved simple variable from registered list.
 * @param modifiers List of requested modifiers to apply to the variable.
 * @param context Context of the plugin.
 * @note Simple variables do not support modifiers so this should ignore
 * them and either warn or throw an error to bring that to the user's attention.
 */
export function getSimpleContent(
  key: VariableKey,
  variable: SimpleVariable,
  modifiers: VariableModifier[],
  context: PluginContext,
): string {
  if (modifiers.length) {
    const error = new Errors.UnexpectedModifierError(key);
    context.raise(error);
  }

  return variable;
}
