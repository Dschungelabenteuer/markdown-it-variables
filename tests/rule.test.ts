import { describe, it, expect } from 'vitest';
import { render, simpleData, htmlBlocks, mdWrappers, advancedData, exampleClass } from './utils';
import { UnknownVariableError } from '../src/errors/UnknownVariable';
import { UnexpectedModifierError } from '../src/errors/UnexpectedModifier';
import { MissingUrlError } from '../src/errors/MissingUrl';
import { MissingAbbreviationError } from '../src/errors/MissingAbbreviation';

const { p, pre, code, strong } = htmlBlocks;
const withClassNameString = '(with className)';
type TheyParams = { src: string; expected: string; data: Record<string, any> };

const they = (statement: string, { src, expected, data }: TheyParams) => {
  const run = (className?: string) => {
    const replace = className ? `<span class="${className}">$1</span>` : '$1';
    const actuallyExpected = p(expected.replace(/<#>(.*?)<\/#>/g, replace));
    expect(render({ data, className }, src)).toStrictEqual(actuallyExpected);
  };

  it(statement, () => {
    run();
  });

  it(`${statement} ${withClassNameString}`, () => {
    run(exampleClass);
  });
};

describe('Rule', () => {
  describe('base behaviour', () => {
    const baseInput = '**Includes #{simple} and #{rich|link}**';

    they('should transform correctly when everything is fine', {
      src: '**Includes #{simple} and #{rich|link}**',
      data: simpleData,
      expected: strong(
        'Includes <#>my simple value</#> and <#><a href="https://github.com">GitHub</a></#>',
      ),
    });

    describe('using modifiers names', () => {
      const data = simpleData;

      they('should correctly create abbreviations', {
        data,
        src: '**Includes #{rich|abbr}**',
        expected: strong('Includes <#><abbr title="GitHub">GH</abbr></#>'),
      });

      they('should correctly create abbreviations inside links', {
        data,
        src: '**Includes #{rich|link|abbr}**',
        expected: strong(
          'Includes <#><a href="https://github.com"><abbr title="GitHub">GH</abbr></a></#>',
        ),
      });
    });

    describe('using modifiers aliases', () => {
      const data = simpleData;

      they('should correctly create abbreviations', {
        data,
        src: '**Includes #{rich|-}**',
        expected: strong('Includes <#><abbr title="GitHub">GH</abbr></#>'),
      });

      they('should correctly create abbreviations inside links', {
        data,
        src: '**Includes #{rich|#|-}**',
        expected: strong(
          'Includes <#><a href="https://github.com"><abbr title="GitHub">GH</abbr></a></#>',
        ),
      });
    });

    they('should work with a more advanced example', {
      data: advancedData,
      src:
        `Founded in #{since}, #{who|#} is the United Nations agency that connects nations,` +
        ` partners and people to promote health, keep the world safe and serve the vulnerable -` +
        ` so everyone, everywhere can attain the highest level of health.` +
        `\n\n` +
        ` #{who|-} leads global efforts to expand universal health coverage.` +
        ` We direct and coordinate the world's response to health emergencies.
    `,
      expected:
        p(
          `Founded in <#>1948</#>, <#><a href="https://www.who.int">World Health Organization</a></#> is the United Nations` +
            ` agency that connects nations, partners and people to promote health, keep the world safe and serve` +
            ` the vulnerable - so everyone, everywhere can attain the highest level of health.`,
        ) +
        p(
          `<#><abbr title="World Health Organization">WHO</abbr></#> leads global efforts to expand universal health` +
            ` coverage. We direct and coordinate the world's response to health emergencies.`,
        ),
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
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow(
        UnknownVariableError,
      );
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
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow(
        UnexpectedModifierError,
      );
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
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow(MissingUrlError);
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
      expect(() => render({ data: simpleData, severity: 'error' }, src)).toThrow(
        MissingAbbreviationError,
      );
    });

    it('should ignore if lower severity', () => {
      const src = baseInput;
      expect(render({ data: simpleData, severity: 'warn' }, src)).toStrictEqual(expected);
      expect(render({ data: simpleData, severity: 'silent' }, src)).toStrictEqual(expected);
    });
  });
});
