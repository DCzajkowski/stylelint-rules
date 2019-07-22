# dczajkowski/color-variables-in-files
Requires variables containing colors to be declared in specified files.

## Usage
```json
{
  "rules": {
    "dczajkowski/color-variables-in-files": [["src/styles/variables.css"]]
  }
}
```

For this config the following applies:

```css
/* This is allowed */

/* in src/styles/variables.css */

:root {
  --color-blue: cornflowerblue;
  --spacing-1: 1rem;
}

.a {
  --color-white: white;
}

/* in src/styles/partials/_navbar.css */

.b {
  --spacing-3: 3rem;
}

/* This is not allowed */

/* in src/styles/partials/_navbar.css */

:root {
  --color-blue: cornflowerblue;
}

.a {
  --color-white: white;
}
```
