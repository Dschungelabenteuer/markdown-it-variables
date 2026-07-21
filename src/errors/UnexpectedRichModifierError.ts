/** Error to be thrown when trying to apply a rich modifier to a simple variable. */
export class UnexpectedRichModifierError extends Error {
  constructor(key: string) {
    super(`Tried to apply a rich modifier on variable "${key}" which is a simple variable`);
    this.name = 'UnexpectedRichModifierError';
  }
}
