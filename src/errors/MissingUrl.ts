/**
 * Error to be thrown when trying to apply the "link" modifier on
 * a rich variable which does not include a `url` property.
 */
export class MissingUrlError extends Error {
  constructor(key: string) {
    super(`Tried to apply "link" modifier on "${key}" which has no "url" property`);
    this.name = 'MissingUrlError';
  }
}
