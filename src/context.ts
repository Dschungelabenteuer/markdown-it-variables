import type { RichVariableMap, Lexicon, PluginOptions, Variable, VariableKey } from './types';
import type { InternalErrors } from './errors';

import { toMap } from './utils';
import { isSimple } from './variables/simple';
import { isRich } from './variables/rich';
import Errors from './errors';

export class PluginContext {
  /** Mapped lexicon bases on data passed to plugin options. */
  lexicon: Lexicon = new Map();

  constructor(public options: PluginOptions) {
    Object.entries(options.data).forEach(([key, variable]: [VariableKey, Variable]) => {
      this.addToLexicon(key, variable);
    });
  }

  /** Used to handle errors based on plugin's severity. */
  raise(error: InternalErrors) {
    if (error instanceof Errors.UnknownVariableError && this.options.ignoreMissingVariables) {
      return console.warn(error.message);
    }

    switch (this.options.severity) {
      case 'error':
        throw error;
      case 'silent':
        return;
      case 'warn':
      default:
        return console.warn(error.message);
    }
  }

  /** Add an option data entry to the lexicon. */
  private addToLexicon(key: VariableKey, variable: Variable) {
    const map = (v: Record<string, unknown>) => toMap<RichVariableMap>(v);
    if (isSimple(variable)) return this.lexicon.set(key, variable);
    if (isRich(variable)) return this.lexicon.set(key, map(variable));
    throw new Errors.UnknownVariableTypeError(key, variable);
  }
}
