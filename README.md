# markdown-it-variables

When writing documentation or any markdown-based content, you might find yourself repeating a lot of
text. Among these repetitive chunks of text, there might be some important units (e.g. product name,
acronyms, etc.) that you would want to keep consistent and easy to write and replace. This
markdown-it plugin is a straightforward way of achieving this.

- ✅ Simple variables `#{productName}` -> `My product`
- ✅ Acronyms: `#{who|-}` to `<abbr title="World Health Organization">WHO</abbr>`
- ✅ Links: `#{who|#}` to `<a href="https://www.who.int">World Health Organization</a>`

## Install

```bash
# Using npm
npm i markdown-it-variables
# Using Yarn
yarn add markdown-it-variables
# Using pnpm
pnpm add markdown-it-variables
```

## Usage

```ts
import mardownIt from 'markdown-it';
import { variablesPlugin } from 'markdown-it-variables';

const md = mardownIt().use(variablesPlugin, {
  since: '1948',
  who: {
    url: 'https://www.who.int',
    abbr: 'WHO',
    label: 'World Health Organization',
  },
});
```

You can then reference your variables from a markdown file: `#{since}` and `#{who}`. You can also
apply a list of pipe-separated modifiers: `#{who|abbr|link}`, and use modifier aliases to get even
more concise: `#{who|-|#}`.

### Modifiers

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Alias</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>abbr</code></td>
      <td><code>-</code></td>
      <td>Displays the abbreviated variable and wraps it with a <code>&lt;abbr&gt;</pre></code> tag, with the full label as a title.</td>
    </tr>
    <tr>
      <td><code>link</code></td>
      <td><code>#</code></td>
      <td>Displays the final content of the variable as a link to provided <code>url</code></td>
    </tr>
  </tbody>
</table>

### Options

#### `data: Record<string, SimpleVariable | ExpandedVariable>`

> List of variables you want to use.

There are two kinds of variables :

1. Simple ones, whose values can be any string.
2. Rich ones, which can define further piece of information that can later be used through
   [modifiers](#modifiers).

The value of rich variables are objects with the following structure:

<table>
  <thead>
    <tr>
      <th>Property name</th>
      <th>Property type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>label</code></td>
      <td><code>string</code></td>
      <td>Full label, mandatory and is used by default.</td>
    </tr>
    <tr>
      <td><code>abbr</code></td>
      <td><code>string?</code></td>
      <td>Shorter version of the variable (e.g. abbreviation/acronym).</td>
    </tr>
    <tr>
      <td><code>url</code></td>
      <td><code>string?</code></td>
      <td>URL to relevant page, used along with the <code>link</code> modifier.</td>
    </tr>
  </tbody>
</table>

---

#### `severity?: 'error' | 'warn' | 'silent'` (optional, defaults to `'warn'`)

> Determines the severity of the plugin.

Here is an overview of how different severities change the behaviour of the plugin:

> ❌ Throws │ ⏭️ Skips (does not transform) │ ✅ Transforms to fallback │ ❕ Prints a warning
> message

<table>
  <thead>
    <tr>
      <th>Scenario</th>
      <th><code>'error'</code></th>
      <th><code>'warn'</code></th>
      <th><code>'silent'</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>No variables</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">❌</td>
    </tr>
    <tr>
      <td>Malformatted variable in options</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">❌</td>
    </tr>
    <tr>
      <td>Referencing an unknown variable</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">⏭️❕</td>
      <td style="text-align: center">⏭️</td>
    </tr>
    <tr>
      <td>Setting a modifier on a simple variable</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅❕</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td>Using <code>link</code> modifier on a rich variable without <code>url</code></td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅❕</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td>Using <code>abbr</code> modifier on a rich variable without <code>abbr</code></td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅❕</td>
      <td style="text-align: center">✅</td>
    </tr>
  </tbody>
</table>

---

#### `ignoreMissingVariables?: boolean` (optional, defaults to `false`)

> When set to `true`, prevents the plugin from throwing when encountering references to missing
> variables.

This basically overwrites the above behaviours with the following:

<table>
  <thead>
    <tr>
      <th>Scenario</th>
      <th><code>'error'</code></th>
      <th><code>'warn'</code></th>
      <th><code>'silent'</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Referencing an unknown variable</td>
      <td style="text-align: center">⏭️</td>
      <td style="text-align: center">⏭️</td>
      <td style="text-align: center">⏭️</td>
    </tr>
  </tbody>
</table>

- It does not throw even if `severity` is set to `'error'`.
- It does not print any warning even if `severity` is set to `'warn'`.

---

## Example

Based on the options illustrated in the [Usage](#usage) section.

Input:

```md
Founded in #{since}, #{who|#} is the United Nations agency that connects nations, partners and
people to promote health, keep the world safe and serve the vulnerable - so everyone, everywhere can
attain the highest level of health.

#{who|-} leads global efforts to expand universal health coverage. We direct and coordinate the
world's response to health emergencies.
```

Output:

```md
Founded in 1948, <a href="https://www.who.int">World Health Organization</a> is the United Nations
agency that connects nations, partners and people to promote health, keep the world safe and serve
the vulnerable - so everyone, everywhere can attain the highest level of health.

<abbr title="World Health Organization">WHO</abbr> leads global efforts to expand universal health
coverage. We direct and coordinate the world's response to health emergencies.
```
