# dczajkowski/color-no-non-variables
Require usage of variables instead of color literals.

## Usage
```json
{
  "rules": {
    "dczajkowski/color-no-non-variables": true
  }
}
```

For this config the following applies:

```css
/* This is allowed */

.a {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
}

/* This is not allowed */

.b {
  background-color: black; /* Color name */
  color: #fff; /* Hex code */
  border-top-color: rgb(10, 20, 30); /* Usage of the rgb function */
  border-left-color: rgba(10, 20, 30, 40%); /* Usage of the rgba function */
  border-right-color: hsl(10, 20%, 30%); /* Usage of the hsl function */
  border-bottom-color: hsla(10, 20%, 30%, 40%); /* Usage of the hsla function */
  background: color(#fff shade(10%));  /* Usage of postcss color function */
  border: 1px solid #000; /* Hex code (or any other of the above) embedded into a complex rule */
}
```
