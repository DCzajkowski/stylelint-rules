# dczajkowski/declaration-property-unit-whitelist
Requires specific properties to have only given units. Stylelint already provides its own [whitelisting](https://stylelint.io/user-guide/rules/declaration-property-unit-whitelist/) and [blacklisting](https://stylelint.io/user-guide/rules/declaration-property-unit-blacklist/) system, but it does not allow to use postcss plugins. We tried to also use a [stylelint processor](https://stylelint.io/developer-guide/processors/), but it would apply globally, breaking some plugins.

## Usage
```json
{
  "rules": {
    "dczajkowski/declaration-property-unit-whitelist": {
      "/^.*border.*/": ["px"],
      "/^.*margin.*/": ["rem"],
      "/^.*padding.*/": ["rem"]
    }
  }
}
```

For this config the following applies:

```css
/* This is allowed */

.a {
  border: 1px solid red;
  border-top-width: 2px;
  margin: 1rem 2rem;

  /*
    Note, that in the following example the % unit is fine as it applies to the
    color, not border width. This would be not possible with the built-in
    `declaration-property-unit-whitelist` rule.
  */
  border-left-color: color(black alpha(10%));
}

/* This is not allowed */

:root {
  --spacing: 1rem;
}

.b {
  border: 1rem solid red;
  border-top-width: var(--spacing);
}
```

## FAQ
### I want to use a new/custom css feature
This plugin uses custom logic to fetch postcss config from the root of the project and apply it to the css file before running the rule. This means, that if you want to use any additional syntax on top of CSS, you will need to add a corresponding plugin to the postcss configuration file.

### CSS variables are not validated
This plugin does not know what is the value of a variable by itself. You need an additional "processor" that can do this expansion for you. The one used by the authors of this plugin is `postcss-cssnext` (see [Usage with cssnext](#usage-with-cssnext)). You may just add it to your postcss plugins list.

### Usage with cssnext
If you are using cssnext you will need to disable the `rem` feature. This is because this feature will expand each _rem_ unit into both _px_ and _rem_. This will make the plugin think you used both units whereas only one was used in the original source. It is encouraged to enable and disable postcss plugins based on an environment variable.

Example configuration for using cssnext with postcss:
```js
const runningInStylelint = // ...

module.exports = () => ({
  plugins: [
    require('postcss-cssnext')({
      features: {
        // ...
        ...runningInStylelint ? { rem: false } : {},
        // ...
      },
    }),
  ],
});
```
