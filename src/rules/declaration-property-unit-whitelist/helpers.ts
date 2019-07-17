import stylelint from 'stylelint';
import postcss from 'postcss';
import { messages, ruleName } from './index';

/**
 * A regex matching units inside CSS values. It looks for a number (it may contain one period inside) followed by
 * a string containing only letters or a percent sign (%). The matching group inside targets the unit itself.
 *
 * Following strings would be matched:
 *   1px; 1.1px; .1px; 1%
 *
 * Following strings would not be matched:
 *   rgb(1, 1, 1); color(black alpha(15%))
 */
export const unitRegex = new RegExp('^\\d*\\.?\\d+([a-zA-Z]+|%)$');

/**
 * Checks if user-provided string looks like regex.
 */
export const isStringRegex = (string: string) => string.startsWith('/') && string.endsWith('/');

/**
 * Reports to stylelint a new rule violation.
 */
export const report = (postcssResult: postcss.Result, declaration: postcss.Declaration, unit: string) =>
  stylelint.utils.report({
    message: messages.illegalUnit(unit, declaration.prop),
    node: declaration,
    result: postcssResult,
    ruleName,
  });
