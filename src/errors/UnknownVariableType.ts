/** Error to be thrown whenever an unknown variable type is encountered. */
export class UnknownVariableTypeError extends Error {
  constructor(key: string, variable: unknown) {
    const getInvalidType = (): string => {
      if (variable === null) return 'null';
      if (Array.isArray(variable)) return 'array';
      return typeof variable;
    };

    super(
      [
        `"${key}" variable is of unknown type. It should either be:`,
        '- simple (resolve to a simple string)',
        '- rich (resolve to an actual object)',
        `Instead, it appears to be of type "${getInvalidType()}"`,
      ].join('\n'),
    );

    this.name = 'UnknownVariableTypeError';
  }
}
