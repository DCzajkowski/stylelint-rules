import { rules, failingRules, readmeEntries } from './helpers';
import test from 'tape';

test('all rules have required files', t => {
  t.plan(rules.length);

  rules.forEach(rule => {
    const { missingFiles } = failingRules.find(({ name }) => name === rule.name) || { missingFiles: [] };
    const message =
      missingFiles.length > 0
        ? `The rule '${rule.name}' is missing files: ${missingFiles.join(', ')}`
        : `The rule '${rule.name}' has all required files`;

    t.isEquivalent(missingFiles, [], message);
  });
});

test('all rules have their entry in the readme', t => {
  t.plan(rules.length * 4);

  const allowedAutoFixableValues = ['❌', '✔️'];

  rules.forEach(({ name }) => {
    const ruleEntry = readmeEntries.find(ruleEntry => ruleEntry.name === name);

    t.ok(ruleEntry, `Main README entry exists for rule '${name}'.`);
    t.true(
      allowedAutoFixableValues.includes(ruleEntry.autoFixable),
      `Rule '${name}' has an autofixable property being an emoji.`,
    );
    t.ok(ruleEntry.description, `Rule '${name}' has a description.`);
    t.true(
      ruleEntry.link === `[${name}](./src/rules/${name}/README.md)`,
      `Rule '${name}' has a valid link to the rule's readme file`,
    );
  });
});
