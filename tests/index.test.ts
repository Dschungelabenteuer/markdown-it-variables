import MarkdownIt from 'markdown-it';
import { describe, expect, it } from 'vitest';
import { variablesPlugin } from '../src';
import { MissingVariablesOptions } from '../src/errors/MissingVariablesOption';

describe.only('Plugin', () => {
  it('should throw if no options was provided', () => {
    expect(() => MarkdownIt().use(variablesPlugin)).toThrow(MissingVariablesOptions);
  });

  it('should throw if options were set but do not include any variable', () => {
    expect(() => MarkdownIt().use(variablesPlugin, { data: undefined })).toThrow(
      MissingVariablesOptions,
    );
  });

  it('should throw if options were set and data object is empty', () => {
    expect(() => MarkdownIt().use(variablesPlugin, { data: {} })).toThrow(MissingVariablesOptions);
  });
});
