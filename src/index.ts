import { createPlugin } from 'stylelint';
import fs from 'fs';
import path from 'path';

export default fs
  .readdirSync(path.join(__dirname, 'rules'), { withFileTypes: true })
  .filter(entity => entity.isDirectory())
  .map(entity => entity.name)
  .map(rule => require(path.join(__dirname, `rules/${rule}`)))
  .map(({ ruleName, default: rule }) => createPlugin(ruleName, rule));
