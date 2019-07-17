import testRule from 'stylelint-test-rule-tape';
import rule, { messages, ruleName } from '../src/rules/declaration-property-unit-whitelist';

testRule(rule, {
  ruleName,
  skipBasicChecks: true,
  config: {
    '/.*border.*/': ['px'],
    '/.*margin.*/': ['rem', 'em'],
  },
  accept: [
    { code: '.a { border: 2px solid red; }' },
    { code: '.a { border-width: 5px; }' },
    { code: '.a { border-top: 5px solid; }' },
    { code: '.a { border-top: 5px solid red; }' },
    { code: '.a { border-top: 5px solid rgba(255, 255, 255, .2); }' },
    { code: '.a { border-top: red 5px solid; }' },
    { code: '.a { border-top: 5px solid color(black alpha(15%)); }' },
    { code: '.a { border-top-width: 5px; }' },
    { code: '.a { margin: .5rem; }' },
    { code: '.a { margin: 1.5rem; }' },
    { code: '.a { margin: 8rem; }' },
    { code: '.a { margin: 8em; }' },
    { code: '.a { margin: 8rem 2rem; }' },
    { code: '.a { margin-top: 8rem; }' },
    { code: '.a { margin-right: 8rem; }' },
    { code: '.a { margin-bottom: 8rem; }' },
    { code: '.a { margin-left: 8rem; }' },
  ],
  reject: [
    { code: '.a { border: 2em solid red; }', message: messages.illegalUnit('em', 'border') },
    { code: '.a { border-width: 5em; }', message: messages.illegalUnit('em', 'border-width') },
    { code: '.a { border-top: 5em solid; }', message: messages.illegalUnit('em', 'border-top') },
    { code: '.a { border-top: 5em solid red; }', message: messages.illegalUnit('em', 'border-top') },
    { code: '.a { border-top: 5em solid rgba(1, 1, 1, .2); }', message: messages.illegalUnit('em', 'border-top') },
    { code: '.a { border-top-width: 5em; }', message: messages.illegalUnit('em', 'border-top-width') },
    { code: '.a { margin: .5px; }', message: messages.illegalUnit('px', 'margin') },
    { code: '.a { margin: 2%; }', message: messages.illegalUnit('%', 'margin') },
    { code: '.a { margin: 1.5px; }', message: messages.illegalUnit('px', 'margin') },
    { code: '.a { margin: 8px; }', message: messages.illegalUnit('px', 'margin') },
    { code: '.a { margin: 8vw; }', message: messages.illegalUnit('vw', 'margin') },
    { code: '.a { margin: 8px 2vh; }', message: messages.illegalUnit('px', 'margin') },
    { code: '.a { margin-top: 8px; }', message: messages.illegalUnit('px', 'margin-top') },
    { code: '.a { margin-right: 8px; }', message: messages.illegalUnit('px', 'margin-right') },
    { code: '.a { margin-bottom: 8px; }', message: messages.illegalUnit('px', 'margin-bottom') },
    { code: '.a { margin-left: 8px; }', message: messages.illegalUnit('px', 'margin-left') },
    {
      code: `
      /* 2 */ :root { --spacing-rem: 1rem; }
      /* 3 */
      /* 4 */ .a {
      /* 5 */   border: var(--spacing-rem) solid red;
      /* 6 */ }
      `,
      message: messages.illegalUnit('rem', 'border'),
      line: 5,
      column: 17,
    },
    {
      code: `
      /* 2 */ .a {
      /* 3 */   margin: 2rem;
      /* 4 */   border: solid 2em red;
      /* 5 */ }
      `,
      message: messages.illegalUnit('em', 'border'),
      line: 4,
    },
    {
      code: `
      /* 2 */ .a {
      /* 3 */   display: block;
      /* 4 */   margin: 1rem 16px 1rem 20em;
      /* 5 */   margin: 7rem;
      /* 6 */ }
      `,
      message: messages.illegalUnit('px', 'margin'),
      line: 4,
    },
  ],
});
