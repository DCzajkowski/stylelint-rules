import { messages } from '../../src/rules/color-variables-in-files';
import test from 'tape';
import { lint } from 'stylelint';
import { Warning } from '../helpers/types';

const runStylelint = async (allowedFiles: string[], file: string) =>
  lint({
    code: `
    /* 2 */ :root {
    /* 3 */   --spacing-4: 1rem;
    /* 4 */   --color-black: #333;
    /* 5 */ }
    /* 6 */
    /* 7 */ .a {
    /* 8 */   --spacing-8: 2rem;
    /* 9 */   --color-blue: cornflowerblue;
    /* 10 */ }
    `,
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

  const { errored } = await runStylelint(['vars/colors.css', 'vars/index.css'], 'vars/index.css');

  t.false(errored);
});

test('disallows color variable declarations in not-allowed files', async t => {
  t.plan(6);

  const allowedFiles = ['vars/colors.css', 'vars/index.css'];
  const file = 'partials/_navbar.css';

  const {
    errored,
    results: [{ warnings: unknownWarnings }],
  } = await runStylelint(allowedFiles, file);

  const warnings = <Warning[]>(<unknown[]>unknownWarnings);

  console.log(warnings[0]);

  t.true(errored);
  t.equals(warnings.length, 2, 'There should be two warnings emitted.');
  t.equals(warnings[0].text, messages.illegalVariableDeclaration('--color-black', file, allowedFiles));
  t.equals(warnings[0].line, 4);
  t.equals(warnings[1].text, messages.illegalVariableDeclaration('--color-blue', file, allowedFiles));
  t.equals(warnings[1].line, 9);
});
