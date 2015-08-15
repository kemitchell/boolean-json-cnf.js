```javascript
var normalize = require('boolean-json-cnf')
var assert = require('assert')

assert.deepEqual(
  normalize(
    { not: {
        or: [ 'p', 'q' ] } }),
  { and: [
    { not: 'p' },
    { not: 'q' } ] })

assert.deepEqual(
  normalize(
    { not: {
        and: [ 'p', 'q' ] } }),
  { or: [
    { not: 'p' },
    { not: 'q' } ] })

assert.deepEqual(
  normalize(
    { not: {
        not: 'p' } }),
  'p')

assert.deepEqual(
  normalize(
    { or: [
        'p',
        { and: [ 'q', 'r' ] } ] }),
  { and: [
      { or: [ 'p', 'q' ] },
      { or: [ 'q', 'r' ] } ] })

assert.deepEqual(
  normalize(
    { or: [
        { and: [ 'q', 'r' ] },
        'p' ] }),
  { and: [
      { or: [ 'p', 'q' ] },
      { or: [ 'q', 'r' ] } ] })
```
