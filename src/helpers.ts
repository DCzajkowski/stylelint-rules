import { names as colorNames, functions as colorFunctions } from './css-colors';

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
export const unitRegex = new RegExp('^(\\d*\\.?\\d+)([a-zA-Z]+|%)$');

export const isColorLiteral = (value: string) =>
  value.startsWith('#') || colorNames.includes(value) || colorFunctions.includes(value);
