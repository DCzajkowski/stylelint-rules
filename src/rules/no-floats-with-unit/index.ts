import stylelint from 'stylelint';
import postcss from 'postcss';
import { unitRegex } from '../../helpers';
import { namespace } from '../../constants';

export const ruleName = `${namespace}/no-floats-with-unit`;
export const messages = stylelint.utils.ruleMessages(ruleName, {
  noFloat: (number: string, unit: string, property: string) =>
    `Illegal use of a float '${number}' with unit '${unit}' in property '${property}'.`,
});

export default function(units: string[]) {
  return async function(postcssRoot: postcss.Root, postcssResult: postcss.Result) {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName);

    if (!validOptions) {
      return;
    }

    postcssRoot.walkDecls(node => {
      postcss.list
        .space(node.value)
        .filter(value => unitRegex.test(value))
        .map(value => value.match(unitRegex))
        .filter(([, value, unit]) => units.includes(unit) && value.includes('.'))
        .slice(0, 1)
        .forEach(([, value, unit]) =>
          stylelint.utils.report({
            message: messages.noFloat(value, unit, node.prop),
            node,
            result: postcssResult,
            ruleName,
          }),
        );
    });
  };
}
