import stylelint from 'stylelint';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import { isStringRegex, report } from './helpers';
import { unitRegex } from '../../helpers';
import { namespace } from '../../constants';

export const ruleName = `${namespace}/declaration-property-unit-whitelist`;
export const messages = stylelint.utils.ruleMessages(ruleName, {
  illegalUnit: (unit: string, property: string) => `Illegal unit '${unit}' used with property '${property}'`,
});

interface Options {
  [_: string]: string[];
}

export default function(options: Options) {
  return async function(originalPostcssRoot: postcss.Root, postcssResult: postcss.Result) {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName);

    if (!validOptions) {
      return;
    }

    const { plugins: postcssPlugins } = postcssrc.sync();
    const { root: postcssRoot } = await postcss(postcssPlugins).process(originalPostcssRoot.toString(), {
      from: undefined,
    });

    if (!postcssRoot) {
      throw 'There was a problem processing the postcss tree.';
    }

    Object.entries(options).forEach(([optionProperty, allowedUnits]) => {
      const matcher = isStringRegex(optionProperty) ? new RegExp(optionProperty.slice(1, -1)) : optionProperty;
      const callback = (node: postcss.Declaration) => {
        postcss.list
          .space(node.value)
          .filter(value => unitRegex.test(value))
          .map(value => value.match(unitRegex))
          .map(([, , unit]) => unit)
          .filter(unit => !allowedUnits.includes(unit))
          .slice(0, 1)
          .forEach(unit => report(postcssResult, node, unit));
      };

      postcssRoot.walkDecls(matcher, callback);
    });
  };
}
