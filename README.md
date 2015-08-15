```javascript
var normalize = require('boolean-json-cnf')
var assert = require('assert')

assert.deepEqual(
  // ¬(p ∨ q)
  normalize({ not: { or: [ 'p', 'q' ] } }),
  // (¬p ∧ ¬q)
  { and: [ { not: 'p' }, { not: 'q' } ] })

assert.deepEqual(
  // ¬(p ∧ q)
  normalize({ not: { and: [ 'p', 'q' ] } }),
  // (p ∨ q)
  { or: [ { not: 'p' }, { not: 'q' } ] })

assert.deepEqual(
  // ¬¬p
  normalize({ not: { not: 'p' } }),
  // p
  'p')

assert.deepEqual(
  // (p ∨ (q ∧ r))
  normalize({ or: [ 'p', { and: [ 'q', 'r' ] } ] }),
  // ((p ∨ q) ∧ (q ∨ r))
  { and: [ { or: [ 'p', 'q' ] }, { or: [ 'q', 'r' ] } ] })

assert.deepEqual(
  // ((q ∧ r) ∨ p)
  normalize({ or: [ { and: [ 'q', 'r' ] }, 'p' ] }),
  // ((p ∨ q) ∧ (q ∨ r))
  { and: [ { or: [ 'p', 'q' ] }, { or: [ 'q', 'r' ] } ] })
```
