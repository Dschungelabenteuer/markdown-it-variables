import type { PluginContext } from '../context';
import type { VariableContent } from '../types';
import { UnknownVariableError } from './UnknownVariable';
import { UnknownVariableTypeError } from './UnknownVariableType';
import { UnexpectedModifierError } from './UnexpectedModifier';
import { MissingAbbreviationError } from './MissingAbbreviation';
import { MissingUrlError } from './MissingUrl';

/** Object of known internal errors. */
const errors = {
  UnknownVariableError,
  UnknownVariableTypeError,
  UnexpectedModifierError,
  MissingAbbreviationError,
  MissingUrlError,
};

/** Type list of internal errors. */
export type InternalErrors =
  | UnknownVariableError
  | UnknownVariableTypeError
  | UnexpectedModifierError
  | MissingAbbreviationError
  | MissingUrlError;

/**
 * Handles any error occuring when transforming variables.
 * @param error Any error thrown throughout the rule logic.
 * @param context Context of the plugin.
 * @param content Source string of the variable reference.
 */
export const handleError = (error: unknown, context: PluginContext, content?: VariableContent) => {
  let caught = false;

  // Handle internal errors based on severity.
  Object.values(errors).forEach((errorType) => {
    if (error instanceof errorType) {
      caught = true;
      context.raise(error);
    }
  });

  // Throw any uncaught errors.
  if (!caught) throw error;

  // If error got caught and is not throwing, fallback to original content or empty string.
  return `#{${content}}` ?? '';
};

export default errors;
