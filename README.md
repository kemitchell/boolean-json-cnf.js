```javascript
var normalize = require('boolean-json-cnf')
```

The package exports a function of one [boolean-json](https://npmjs.com/packages/boolean-json-schema) object.

# DeMorgan's Laws

```javascript
var assert = require('assert')

assert.deepEqual(
  // ¬(p ∨ q ∨ r)
  normalize({ not: { or: [ 'p', 'q', 'r' ] } }),
  // (¬p ∧ ¬q ∧ ¬r)
  { and: [ { not: 'p' }, { not: 'q' }, { not: 'r' } ] })

assert.deepEqual(
  // ¬(p ∧ q)
  normalize({ not: { and: [ 'p', 'q' ] } }),
  // (p ∨ q)
  { or: [ { not: 'p' }, { not: 'q' } ] })
```

# Double Negation

```javascript
assert.deepEqual(
  // ¬¬p
  normalize({ not: { not: 'p' } }),
  // p
  'p')
```

# Distribution

## Disjunction Over Disjunction

```javascript
assert.deepEqual(
  // (p ∨ (q ∨ r))
  normalize({ or: [ 'p', { or: [ 'q', 'r' ] } ] }),
  // (p ∨ q ∨ r))
  { or: [ 'p', 'q', 'r' ] })
```

## Disjunction Over Conjunction

```javascript
assert.deepEqual(
  // (p ∨ (q ∧ r))
  normalize({ or: [ 'p', { and: [ 'q', 'r' ] } ] }),
  // ((p ∨ q) ∧ (p ∨ r))
  { and: [
      { or: [ 'p', 'q' ] },
      { or: [ 'p', 'r' ] } ] })
```
