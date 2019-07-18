import testRule from 'stylelint-test-rule-tape';
import rule, { messages, ruleName } from '../src/rules/color-no-non-variables';

testRule(rule, {
  ruleName,
  config: true,
  accept: [
    { code: '.a { background-color: var(--background-color); }' },
    { code: '.a { border: 1px solid var(--border-color); }' },
    { code: '.a { border-color: var(--border-y-color) var(--border-x-color); }' },
    { code: '.a { color: var(--blue); }' },
    { code: ':root { --var-declaration: #fff; }' },
    { code: ':root { --blue: rgb(10, 20, 30); }' },
  ],
  reject: [
    { code: '.a { background-color: black; }', message: messages.illegalColorLiteral('black', 'background-color') },
    { code: '.a { border: 1px solid #000; }', message: messages.illegalColorLiteral('#000', 'border') },
    {
      code: '.a { border: 1px solid rgba(0, 0, 0, 0.15); }',
      message: messages.illegalColorLiteral('rgba(0, 0, 0, 0.15)', 'border'),
    },
    {
      code: '.a { border-color: #000 rgba(0, 0, 0, 0.15); }',
      message: messages.illegalColorLiteral('#000', 'border-color'),
    },
    {
      code: '.a { border-color: rgba(0, 0, 0, 0.15) #000; }',
      message: messages.illegalColorLiteral('rgba(0, 0, 0, 0.15)', 'border-color'),
    },
    {
      code: '.a { border-color: rgba(0, 0, 0, 0.35) rgba(0, 0, 0, 0.25); }',
      message: messages.illegalColorLiteral('rgba(0, 0, 0, 0.35)', 'border-color'),
    },
    {
      code: '.a { border-top-color: rgb(10, 20, 30); }',
      message: messages.illegalColorLiteral('rgb(10, 20, 30)', 'border-top-color'),
    },
    {
      code: '.a { color: rgba(10, 20, 30, 40%); }',
      message: messages.illegalColorLiteral('rgba(10, 20, 30, 40%)', 'color'),
    },
    {
      code: '.a { color: hsla(10, 20%, 30%, 40%); }',
      message: messages.illegalColorLiteral('hsla(10, 20%, 30%, 40%)', 'color'),
    },
    {
      code: '.a { color: color(#fff shade(10%)); }',
      message: messages.illegalColorLiteral('color(#fff shade(10%))', 'color'),
    },
    { code: '.a { color: #fff; }', message: messages.illegalColorLiteral('#fff', 'color') },
    { code: '.a { color: #fff; }', message: messages.illegalColorLiteral('#fff', 'color') },
    {
      code: '.a { border-color: blue red; }',
      message: messages.illegalColorLiteral('blue', 'border-color'),
    },
    {
      code: '.a { border-color: var(--border-y-color) red; }',
      message: messages.illegalColorLiteral('red', 'border-color'),
    },
    {
      code: `
      /* 2 */ .a {
      /* 3 */   margin: 2rem;
      /* 4 */   border: solid 2em red;
      /* 5 */ }
      `,
      message: messages.illegalColorLiteral('red', 'border'),
      line: 4,
    },
  ],
});
