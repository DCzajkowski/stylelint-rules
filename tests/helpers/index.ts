import fs from 'fs';
import path from 'path';

const testsDir = 'tests/rules';
const rulesDir = 'src/rules';
const readmePath = path.join(__dirname, '../../README.md');

const requiredRuleFiles = (rule: string) => [
  `${rulesDir}/${rule}/README.md`,
  `${rulesDir}/${rule}/index.ts`,
  `${testsDir}/${rule}.ts`,
];
const load = (
  pathSegments: string[],
  options: { encoding?: string | null; withFileTypes: true } = { withFileTypes: true },
): fs.Dirent[] => fs.readdirSync(path.join(__dirname, '../..', ...pathSegments), options);

const tests = load([testsDir]).map(({ name }) => `${testsDir}/${name}`);

export const rules = load([rulesDir], { withFileTypes: true })
  .filter((entity: { isDirectory: () => void }) => entity.isDirectory())
  .map(({ name }) => ({
    name,
    files: [...load([rulesDir, name]).map(file => `${rulesDir}/${name}/${file.name}`), ...tests],
  }));

export const failingRules = rules
  .filter(({ name, files }) =>
    requiredRuleFiles(name)
      .map(requiredFile => files.includes(requiredFile))
      .some(b => !b),
  )
  .map(({ name, files }) => ({
    name,
    files,
    missingFiles: requiredRuleFiles(name).filter(v => files.indexOf(v) < 0),
  }));

const readmeContent = fs.readFileSync(readmePath).toString();
const [, readmeTable] = new RegExp('<!-- rules-declaration -->([\\S\\s]+)<!-- \\/rules-declaration -->', 'gm').exec(
  readmeContent,
);

export const readmeEntries = readmeTable
  .split('\n')
  .slice(3, -1)
  .map(row =>
    row
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim()),
  )
  .map(([autoFixable, link, description]) => ({
    autoFixable,
    link,
    description,
    name: link.match(new RegExp('\\[(.+)\\]'))[1],
  }));
