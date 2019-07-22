import stylelint from 'stylelint';
import postcss from 'postcss';
import { namespace } from '../../constants';
import { isColorLiteral } from '../../helpers';

export const ruleName = `${namespace}/color-variables-in-files`;
export const messages = stylelint.utils.ruleMessages(ruleName, {
  illegalVariableDeclaration: (variable: string, file: string, allowedFiles: string[]) =>
    `Illegal color variable '${variable}' declaration in file '${file}'. Allowed files: ${allowedFiles
      .map(file => `'${file}'`)
      .join(', ')}.`,
});

const isVariableDeclaration = (prop: string) => prop.startsWith('--');

export default function(allowedFiles: string[] = []) {
  return async function(postcssRoot: postcss.Root, postcssResult: postcss.Result) {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName);

    if (!validOptions || !Array.isArray(allowedFiles)) {
      return;
    }

    const rootPath = `${process.cwd()}/`;

    postcssRoot.walkDecls(node => {
      const {
        prop,
        value,
        source: {
          input: { file },
        },
      } = node;

      if (!isVariableDeclaration(prop) || !isColorLiteral(value) || !file) {
        return;
      }

      const relativePath = file.replace(rootPath, '');

      if (allowedFiles.includes(relativePath)) {
        return;
      }

      stylelint.utils.report({
        message: messages.illegalVariableDeclaration(prop, relativePath, allowedFiles),
        result: postcssResult,
        ruleName,
        node,
      });
    });
  };
}
