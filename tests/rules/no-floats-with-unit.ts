import testRule from 'stylelint-test-rule-tape';
import rule, { messages, ruleName } from '../../src/rules/no-floats-with-unit';

testRule(rule, {
  ruleName,
  config: [['px']],
  accept: [
    { code: '.a { border-width: 5px; }' },
    { code: '.a { border: 2px solid red; }' },
    { code: '.a { margin: .5rem; }' },
    { code: '.a { margin: 1.5rem; }' },
    { code: '.a { margin: 5rem; }' },
  ],
  reject: [
    { code: '.a { border-width: .5px; }', message: messages.noFloat('.5', 'px', 'border-width') },
    { code: '.a { border-width: 0.5px; }', message: messages.noFloat('0.5', 'px', 'border-width') },
    { code: '.a { border: solid .5px black; }', message: messages.noFloat('.5', 'px', 'border') },
    { code: '.a { border: solid 0.5px black; }', message: messages.noFloat('0.5', 'px', 'border') },
    {
      code: `
      /* 2 */ .a {
      /* 3 */   display: block;
      /* 4 */   border: solid .5px black;
      /* 5 */   margin: 7rem;
      /* 6 */ }
      `,
      message: messages.noFloat('.5', 'px', 'border'),
      line: 4,
    },
  ],
});

testRule(rule, {
  ruleName,
  config: [['px', 'rem']],
  accept: [
    { code: '.a { border-width: 5px; }' },
    { code: '.a { margin: 5rem; }' },
    { code: '.a { margin: .5em; }' },
    { code: '.a { border: 2px solid red; }' },
  ],
  reject: [
    { code: '.a { margin: .5px; }', message: messages.noFloat('.5', 'px', 'margin') },
    { code: '.a { margin: 0.5px; }', message: messages.noFloat('0.5', 'px', 'margin') },
    { code: '.a { margin: .5rem; }', message: messages.noFloat('.5', 'rem', 'margin') },
    { code: '.a { margin: 1.5rem; }', message: messages.noFloat('1.5', 'rem', 'margin') },
  ],
});
