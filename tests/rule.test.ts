import { describe, it, expect } from 'vitest';
import { render, simpleData, htmlBlocks, mdWrappers, advancedData } from './utils';

const { p, pre, code, strong } = htmlBlocks;

describe('Rule', () => {
  describe('base behaviour', () => {
    const baseInput = '**Includes #{simple} and #{rich|link}**';

    it('should transform correctly when everything is fine', () => {
      const src = baseInput;
      const output = 'Includes my simple value and <a href="https://github.com">GitHub</a>';
      const expected = p(strong(output));
      expect(render({ data: simpleData }, src)).toStrictEqual(expected);
    });

    describe('using modifiers names', () => {
      it('should correctly create abbreviations', () => {
        const src = '**Includes #{rich|abbr}**';
        const output = 'Includes <abbr title="GitHub">GH</abbr>';
        const expected = p(strong(output));
        expect(render({ data: simpleData }, src)).toStrictEqual(expected);
      });

      it('should correctly create abbreviations inside links', () => {
        const src = '**Includes #{rich|link|abbr}**';
        const output = 'Includes <a href="https://github.com"><abbr title="GitHub">GH</abbr></a>';
        const expected = p(strong(output));
        expect(render({ data: simpleData }, src)).toStrictEqual(expected);
      });
    });

    describe('using modifiers aliases', () => {
      it('should correctly create abbreviations', () => {
        const src = '**Includes #{rich|-}**';
        const output = 'Includes <abbr title="GitHub">GH</abbr>';
        const expected = p(strong(output));
        expect(render({ data: simpleData }, src)).toStrictEqual(expected);
      });

      it('should correctly create abbreviations inside links', () => {
        const src = '**Includes #{rich|#|-}**';
        const output = 'Includes <a href="https://github.com"><abbr title="GitHub">GH</abbr></a>';
        const expected = p(strong(output));
        expect(render({ data: simpleData }, src)).toStrictEqual(expected);
      });
    });

    it('should work with a more advanced example', () => {
      const src =
        `Founded in #{since}, #{who|#} is the United Nations agency that connects nations,` +
        ` partners and people to promote health, keep the world safe and serve the vulnerable -` +
        ` so everyone, everywhere can attain the highest level of health.` +
        `\n\n` +
        ` #{who|-} leads global efforts to expand universal health coverage.` +
        ` We direct and coordinate the world's response to health emergencies.
      `;
      const expected =
        p(
          `Founded in 1948, <a href="https://www.who.int">World Health Organization</a> is the United Nations` +
            ` agency that connects nations, partners and people to promote health, keep the world safe and serve` +
            ` the vulnerable - so everyone, everywhere can attain the highest level of health.`,
        ) +
        p(
          `<abbr title="World Health Organization">WHO</abbr> leads global efforts to expand universal health` +
            ` coverage. We direct and coordinate the world's response to health emergencies.`,
        );

      expect(render({ data: advancedData }, src)).toStrictEqual(expected);
    });

    it('should not transform when used withing inline code', () => {
      const src = baseInput;
      const expected = p(code(src));
      const input = mdWrappers.codeInline(src);
      expect(render({ data: simpleData }, input)).toStrictEqual(expected);
    });

    it('should not transform when used withing code blocks', () => {
      const src = baseInput;
      const language = 'bash';
      const expected = pre(code(src, language));
      const input = mdWrappers.codeBlock(src, language);
      expect(render({ data: simpleData }, input)).toStrictEqual(expected);
    });
  });

  describe('when variable does not exist', () => {
    const baseInput = '**Includes #{inexistant|link}**';
    const output = 'Includes #{inexistant|link}';
    const expected = `${p(strong(output))}`;

    it('should not throw if severity is set to error', () => {
      const src = baseInput;
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow();
    });

    it('should ignore if severity is set to error but "ignoreMissingVariables" set to true', () => {
      const src = baseInput;
      expect(
        render(
          {
            data: simpleData,
            severity: 'error',
            ignoreMissingVariables: true,
          },
          src,
        ),
      ).toStrictEqual(expected);
    });

    it('should ignore if lower severity', () => {
      const src = baseInput;
      expect(render({ data: simpleData, severity: 'warn' }, src)).toStrictEqual(expected);
      expect(render({ data: simpleData, severity: 'silent' }, src)).toStrictEqual(expected);
    });
  });

  describe('when modifiers are set on simple variables', () => {
    const baseInput = '**Includes #{simple|abbr}**';
    const output = 'Includes my simple value';
    const expected = `${p(strong(output))}`;

    it('should throw if severity is set to error', () => {
      const src = baseInput;
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow();
    });

    it('should ignore if lower severity', () => {
      const src = baseInput;
      expect(render({ data: simpleData, severity: 'warn' }, src)).toStrictEqual(expected);
      expect(render({ data: simpleData, severity: 'silent' }, src)).toStrictEqual(expected);
    });
  });

  describe('when "link" modifier is set on a variable which does not include a link', () => {
    const baseInput = '**Includes #{richWithoutLink|link}**';
    const output = 'Includes Rich Without Link';
    const expected = `${p(strong(output))}`;

    it('should throw if severity is set to error', () => {
      const src = baseInput;
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow();
    });

    it('should ignore if lower severity', () => {
      const src = baseInput;
      expect(render({ data: simpleData, severity: 'warn' }, src)).toStrictEqual(expected);
      expect(render({ data: simpleData, severity: 'silent' }, src)).toStrictEqual(expected);
    });
  });

  describe('when "abbr" modifier is set on a variable which does not include a abbreviated version', () => {
    const baseInput = '**Includes #{richWithoutShort|abbr}**';
    const output = 'Includes Rich Without Short';
    const expected = `${p(strong(output))}`;

    it('should throw if severity is set to error', () => {
      const src = baseInput;
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow();
    });

    it('should ignore if lower severity', () => {
      const src = baseInput;
      expect(render({ data: simpleData, severity: 'warn' }, src)).toStrictEqual(expected);
      expect(render({ data: simpleData, severity: 'silent' }, src)).toStrictEqual(expected);
    });
  });
});
