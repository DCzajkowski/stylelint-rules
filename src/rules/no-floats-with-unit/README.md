# dczajkowski/no-floats-with-unit
Requires specific units' values to be full integers instead of floats.

## Usage
```json
{
  "rules": {
    "dczajkowski/dczajkowski/no-floats-with-unit": [['px', '%']]
  }
}
```

For this config the following applies:

```css
/* This is allowed */

.a {
  margin: 1px;
  margin: 1%;
  margin: 1rem;
  margin: .1rem;
}

/* This is not allowed */

.b {
  margin: .1px;
  margin: .1%;
}
```
