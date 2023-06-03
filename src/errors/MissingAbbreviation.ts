/**
 * Error to be thrown when trying to apply the "abbr" modifier on
 * a rich variable which does not include a `abbr` property.
 */
export class MissingAbbreviationError extends Error {
  constructor(key: string) {
    super(`Tried to apply "abbr" modifier on "${key}" which has no "abbr" property`);
    this.name = 'MissingAbbreviationError';
  }
}
