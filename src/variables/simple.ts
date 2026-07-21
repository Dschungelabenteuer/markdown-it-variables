import type { SimpleVariable, VariableKey } from '../types';
import type { PluginContext } from '../context';
import Errors from '../errors';
import type { VariableModifier } from '../modifiers';
import { hasUcfirstModifier } from '../modifiers/simple';
import { hasRichModifier } from '../modifiers/rich';
import { ucfirst } from '../utils';

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
  context: PluginContext
): string {
  if (hasRichModifier(modifiers)) {
    const error = new Errors.UnexpectedRichModifierError(key);
    context.raise(error);
  }

  return hasUcfirstModifier(modifiers) ? ucfirst(variable) : variable;
}
