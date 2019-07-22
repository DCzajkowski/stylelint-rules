import { messages } from '../../src/rules/variables-in-files';
import test from 'tape';
import { lint } from 'stylelint';

const runStylelint = async (allowedFiles: string[], file: string) =>
  lint({
    code: `
    :root {
      --spacing: 1rem;
    }

    .a {
      --color-blue: cornflowerblue;
    }
    `,
    codeFilename: file,
    config: {
      plugins: ['@dczajkowski/stylelint-rules'],
      rules: {
        'dczajkowski/variables-in-files': [allowedFiles],
      },
    },
  });

test('accepts variable declarations in allowed files', async t => {
  t.plan(1);

  const { errored } = await runStylelint(['vars/colors.css', 'vars/index.css'], 'vars/index.css');

  t.false(errored);
});

interface Warning {
  line: number;
  column: number;
  rule: string;
  severity: 'error';
  text: string;
}

test('disallows variable declarations in not-allowed files', async t => {
  t.plan(4);

  const allowedFiles = ['vars/colors.css', 'vars/index.css'];
  const file = 'partials/_navbar.css';

  const {
    errored,
    results: [{ warnings: unknownWarnings }],
  } = await runStylelint(allowedFiles, file);

  const warnings = <Warning[]>(<unknown[]>unknownWarnings);

  t.true(errored);
  t.equals(warnings.length, 2, 'There should be two warnings emitted.');
  t.equals(warnings[0].text, messages.illegalVariableDeclaration('--spacing', file, allowedFiles));
  t.equals(warnings[1].text, messages.illegalVariableDeclaration('--color-blue', file, allowedFiles));
});
