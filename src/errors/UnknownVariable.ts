/** Error to be thrown whenever an unknown variable is encountered. */
export class UnknownVariableError extends Error {
  constructor(key: string) {
    super(`Tried to display variable "${key}", but it does not exist in variable list`);
    this.name = 'UnknownVariableError';
  }
}
