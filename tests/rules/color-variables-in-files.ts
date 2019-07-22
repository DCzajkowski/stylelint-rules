import { messages } from '../../src/rules/color-variables-in-files';
import test from 'tape';
import { lint } from 'stylelint';
import { Warning } from '../helpers/types';

const runStylelint = async (allowedFiles: string[], file: string, code: string) =>
  lint({
    code,
    codeFilename: file,
    config: {
      plugins: ['@dczajkowski/stylelint-rules'],
      rules: {
        'dczajkowski/color-variables-in-files': [allowedFiles],
      },
    },
  });

test('accepts all variable declarations in allowed files', async t => {
  t.plan(1);

  const { errored } = await runStylelint(
    ['vars/colors.css', 'vars/index.css'],
    'vars/index.css',
    `
    :root {
      --spacing-4: 1rem;
      --color-black: #333;
      --color-black-semi-transparent: rgba(0, 0, 0, 75%);
      --color-gray: gray(200);
      --color-blue: color(cornflowerblue alpha(15%));
    }

    .a {
      --spacing-8: 2rem;
      --color-blue: cornflowerblue;
    }
    `,
  );

  t.false(errored);
});

test('disallows color variable declarations in not-allowed files', async t => {
  t.plan(6);

  const allowedFiles = ['vars/colors.css', 'vars/index.css'];
  const file = 'partials/_navbar.css';

  const {
    errored,
    results: [{ warnings: unknownWarnings }],
  } = await runStylelint(
    allowedFiles,
    file,
    `
    /* 2 */  :root {
    /* 3 */    --spacing-4: 1rem;
    /* 4 */    --color-black: #333;
    /* 5 */  }
    /* 6 */
    /* 7 */  .a {
    /* 8 */    --spacing-8: 2rem;
    /* 9 */    --color-blue: cornflowerblue;
    /* 10 */ }
    `,
  );

  const warnings = <Warning[]>(<unknown[]>unknownWarnings);

  t.true(errored);
  t.equals(warnings.length, 2, 'There should be two warnings emitted.');
  t.equals(warnings[0].text, messages.illegalVariableDeclaration('--color-black', file, allowedFiles));
  t.equals(warnings[0].line, 4);
  t.equals(warnings[1].text, messages.illegalVariableDeclaration('--color-blue', file, allowedFiles));
  t.equals(warnings[1].line, 9);
});

test('disallows color functions in variable declarations in not-allowed files', async t => {
  t.plan(5);

  const allowedFiles = ['vars/colors.css', 'vars/index.css'];
  const file = 'partials/_navbar.css';

  const {
    errored,
    results: [{ warnings: unknownWarnings }],
  } = await runStylelint(
    allowedFiles,
    file,
    `
    .a {
      --color-black-semi-transparent: rgba(0, 0, 0, 75%);
      --color-gray: gray(200);
      --color-blue: color(cornflowerblue alpha(15%));
    }
    `,
  );

  const warnings = <Warning[]>(<unknown[]>unknownWarnings);

  t.true(errored);
  t.equals(warnings.length, 3, 'There should be three warnings emitted.');
  t.equals(warnings[0].text, messages.illegalVariableDeclaration('--color-black-semi-transparent', file, allowedFiles));
  t.equals(warnings[1].text, messages.illegalVariableDeclaration('--color-gray', file, allowedFiles));
  t.equals(warnings[2].text, messages.illegalVariableDeclaration('--color-blue', file, allowedFiles));
});
