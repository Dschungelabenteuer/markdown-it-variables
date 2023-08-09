import type BaseStateInline from 'markdown-it/lib/rules_inline/state_inline';

/** Rule function's signature. */
export type RuleFunction = (state: BaseStateInline, silent: boolean) => void;

/** Content of a variable. */
export type VariableContent = string;

/** Lexicon (map of variables). */
export type Lexicon = Map<string, SimpleVariable | RichVariableMap>;

/** Supported variable modifiers. */
export type VariableModifier =
  // When you only want to display the abbreviation.
  | 'abbr'
  | '-'
  //  When you want to link to a reference.
  | 'link'
  | '#';

/** Type of a variable key. */
export type VariableKey = string;

/** Array declaration of a variable reference. */
export type VariableDeclarationParams = [VariableKey, ...VariableModifier[]];

/** Variable definition. */
export type Variable = SimpleVariable | RichVariable;

/** Simplest variable type. */
export type SimpleVariable = string;

/** Rich variable type. */
export type RichVariable = {
  /** URL to attach if the variable has the `link` modifier. */
  url?: string;
  /** Full label of the variable. */
  label: string;
  /** Abbreviation to use if the variable has the `abbr` modifier. */
  abbr?: string;
};

/** Mapped version of an rich variable type. */
export type RichVariableMap = Map<keyof RichVariable, RichVariable[keyof RichVariable]>;

/** Represents the `data` option of the plugin. */
export type PluginVariables = Record<string, Variable>;

/** Represents the severity level of the plugin. */
export type PluginSeverity = 'error' | 'warn' | 'silent';

/** Options of the plugin. */
export type PluginOptions = {
  /** Map of keys to Variable (simple or rich). */
  data: PluginVariables;
  /** Available log levels. */
  severity?: PluginSeverity;
  /** Base class name (all outter tags of variables will have it as a class name). */
  className?: string;
  /** Determines whether non-existant variables should be ignored. */
  ignoreMissingVariables?: boolean;
};

/** HTML Tag definition. */
export type HTMLTagDefinition = {
  tagName: keyof HTMLElementTagNameMap;
  content: string;
  attributes?: Record<string, any>;
};
