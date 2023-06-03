import { basePluginName } from '../config';

/**
 * Error to be thrown when trying to use the plugin without specifying
 * its options or any variable.
 */
export class MissingVariablesOptions extends Error {
  constructor() {
    super(`Tried to use "${basePluginName}" without specifying any variable`);
    this.name = 'MissingVariablesOptions';
  }
}
