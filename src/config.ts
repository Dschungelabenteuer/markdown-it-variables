/** Base plugin name. */
export const basePluginName = 'markdown-it-variables';

/** Base rule name to avoid collision. */
export const baseRuleName = 'variables_rule';

/** Base renderer name to avoid collision. */
export const baseRendererName = 'variablesRenderer';

/** Inline markdown pattern which triggers the plugin logic. */
export const rulePattern = /#\{([^}]*)}/g;

/** Start delimiter of a variable. */
export const ruleStartsWith = '#{';

/** End delimiter of a variable. */
export const ruleEndsWith = '}';

/** Separator character use to apply multiple modifiers to a variable. */
export const modifierSeparator = '|';
