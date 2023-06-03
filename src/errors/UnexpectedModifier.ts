/** Error to be thrown when trying to apply a modifier to a simple variable. */
export class UnexpectedModifierError extends Error {
  constructor(key: string) {
    super(`Tried to apply a modifier on variable "${key}" which is a simple variable`);
    this.name = 'UnexpectedModifierError';
  }
}
