import type { RichVariableModifier } from './rich';
import type { SimpleVariableModifier } from './simple';

/** Supported variable modifiers. */
export type VariableModifier = SimpleVariableModifier | RichVariableModifier;

/** Signature of a function asserting the presence of a modifier. */
export type HasModifier = (modifiers: VariableModifier[]) => boolean;

/** Determines function that determines if a variable has a specific modifier. */
export const hasGivenModifier = <T extends readonly string[]>(
  modifierAliases: T,
  modifiersToCheck: VariableModifier[]
): boolean => modifiersToCheck.some((modifier) => modifierAliases.includes(modifier));
