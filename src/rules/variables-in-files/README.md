# dczajkowski/variables-in-files
Requires variables to be declared in specified files.

## Usage
```json
{
  "rules": {
    "dczajkowski/variables-in-files": [["src/styles/variables.css"]]
  }
}
```

For this config the following applies:

```css
/* This is allowed */

/* in src/styles/variables.css */

:root {
  --color-blue: cornflowerblue;
}

.a {
  --color-white: white;
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
