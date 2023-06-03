import { describe, expect, it } from 'vitest';

import type { PluginOptions } from '../src/types';
import { simpleData } from './utils';
import { PluginContext } from '../src/context';

describe('Context', () => {
  describe('addToLexicon', () => {
    const validData = simpleData;
    const normalCount = Object.keys(validData).length;

    it('should build up the lexicon', () => {
      const options: PluginOptions = { data: validData };
      expect(new PluginContext(options).lexicon.size).toStrictEqual(normalCount);
    });

    describe('with any invalid variable type', () => {
      const invalidData = { ...validData, invalid: 5 } as any;

      it('should throw if severity is set to error', () => {
        const options: PluginOptions = { data: invalidData, severity: 'error' };
        expect(() => new PluginContext(options).lexicon.size).toThrow();
      });

      it('should still throw even if severity is lower', () => {
        const options: PluginOptions = { data: invalidData, severity: 'warn' };
        expect(() => new PluginContext(options).lexicon.size).toThrow();
      });
    });
  });
});
