import stylelint from 'stylelint';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import { functions as colorFunctions, names as colorNames } from './css-colors';
import { namespace } from '../../constants';

export const ruleName = `${namespace}/color-no-non-variables`;
export const messages = stylelint.utils.ruleMessages(ruleName, {
  illegalColorLiteral: (color: string, property: string) =>
    `Illegal use of a literal '${color}' with property '${property}'. Expected a variable.`,
});

export default function() {
  return async function(postcssRoot: postcss.Root, postcssResult: postcss.Result) {
    const isVariableDeclaration = (node: postcss.Declaration) => node.prop.startsWith('--');
    const isColorLiteral = (value: string) =>
      value.startsWith('#') || colorNames.includes(value) || colorFunctions.includes(value);
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName);

    if (!validOptions) {
      return;
    }

    postcssRoot.walkDecls((node: postcss.Declaration) => {
      if (isVariableDeclaration(node)) {
        return;
      }

      let reported = false;

      valueParser(node.value).walk(({ value, type }) => {
        if (reported || !isColorLiteral(value)) {
          return;
        }

        stylelint.utils.report({
          message: messages.illegalColorLiteral(type === 'function' ? node.value : value, node.prop),
          result: postcssResult,
          node,
          ruleName,
        });

        reported = true;
      });
    });
  };
}
