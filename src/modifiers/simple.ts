import type { HasModifier } from '.';
import { hasGivenModifier } from '.';

/** When you want to uppercase the first letter of the variable. */
const UCFIRST_MODIFIERS = ['ucfirst', '^'] as const;
/** Determines if a variable's modifiers has an uppercase first letter modifier. */
export const hasUcfirstModifier: HasModifier = (m) => hasGivenModifier(UCFIRST_MODIFIERS, m);

/** Supported simple variable modifiers (applicable to both simple and rich variables). */
export const SimpleModifiers = [...UCFIRST_MODIFIERS] as const;
/** Supported simple variable modifiers (applicable to both simple and rich variables). */
export type SimpleVariableModifier = (typeof SimpleModifiers)[number];
