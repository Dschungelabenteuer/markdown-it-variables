import { hasGivenModifier } from '.';
import type { HasModifier, VariableModifier } from '.';

/** When you only want to display the abbreviation. */
const ABBR_MODIFIERS = ['abbr', '-'] as const;
/** Determines if a variable's modifiers has an abbreviation modifier. */
export const hasAbbrModifier: HasModifier = (m) => hasGivenModifier(ABBR_MODIFIERS, m);

/** When you want to link to a reference. */
const LINK_MODIFIERS = ['link', '#'] as const;
/** Determines if a variable's modifiers has a link modifier. */
export const hasLinkModifier: HasModifier = (m) => hasGivenModifier(LINK_MODIFIERS, m);

/** Supported rich variable modifiers (only applicable to rich variables). */
export const RichModifiers = [...ABBR_MODIFIERS, ...LINK_MODIFIERS] as const;
/** Supported variable modifiers (only applicable to rich variables). */
export type RichVariableModifier = (typeof RichModifiers)[number];

export type HasRichModifier = (modifiers: VariableModifier[]) => boolean;
export const hasRichModifier: HasRichModifier = (m) => hasGivenModifier([...RichModifiers], m);
