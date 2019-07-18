import stylelint from 'stylelint';
import postcss from 'postcss';
import { messages, ruleName } from './index';

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
