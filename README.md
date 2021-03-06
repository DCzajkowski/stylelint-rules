# @dczajkowski/stylelint-rules
This is a [stylelint](https://stylelint.io/) plugin that provides several stylelint rules that are not available out of the box.

## Installation
```bash
npm i @dczajkowski/stylelint-rules --save-dev # yarn add -D @dczajkowski/stylelint-rules
```

In your `.stylelintrc` config:

```json
{
  "plugins": ["@dczajkowski/stylelint-rules"],
  "rules": {

  }
}
```

## Available Rules

<!-- rules-declaration -->
| auto-fixable? | Rule Name | Description |
| :-: | :-- | :-- |
| ❌ | [declaration-property-unit-whitelist](./src/rules/declaration-property-unit-whitelist/README.md) | Require specific properties to have only given units |
| ❌ | [color-no-non-variables](./src/rules/color-no-non-variables/README.md) | Disallow usage of color literals (allows only variables) |
| ❌ | [no-floats-with-unit](./src/rules/no-floats-with-unit/README.md) | Disallow usage of floats with certain units |
| ❌ | [variables-in-files](./src/rules/variables-in-files/README.md) | Allow for variables to be declared only in specified files |
| ❌ | [color-variables-in-files](./src/rules/color-variables-in-files/README.md) | Allow for variables containing color values to be declared only in specified files |
<!-- /rules-declaration -->

## License
This plugin is an open-sourced software licensed under the MIT license.
