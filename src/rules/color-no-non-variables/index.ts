import stylelint from 'stylelint';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import { isColorLiteral } from '../../helpers';
import { namespace } from '../../constants';

export const ruleName = `${namespace}/color-no-non-variables`;
export const messages = stylelint.utils.ruleMessages(ruleName, {
  illegalColorLiteral: (color: string, property: string) =>
    `Illegal use of a literal '${color}' with property '${property}'. Expected a variable.`,
});

export default function(options: boolean) {
  return async function(postcssRoot: postcss.Root, postcssResult: postcss.Result) {
    const isVariableDeclaration = (node: postcss.Declaration) => node.prop.startsWith('--');
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName);

    if (!validOptions || options !== true) {
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

        const literal =
          type === 'function'
            ? postcss.list
                .space(node.value)
                .filter(v => v.startsWith(value))
                .shift()
            : value;

        stylelint.utils.report({
          message: messages.illegalColorLiteral(literal, node.prop),
          result: postcssResult,
          node,
          ruleName,
        });

        reported = true;
      });
    });
  };
}
