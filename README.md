```javascript
var normalize = require('boolean-json-cnf')
var assert = require('assert')

assert.deepEqual(
  normalize(
    { not: {
        or: [
          { variable: 'p' },
          { variable: 'q' } ] } }),
  { and: [
    { not: { variable: 'p' } },
    { not: { variable: 'q' } } ] })

assert.deepEqual(
  normalize(
    { not: {
        and: [
          { variable: 'p' },
          { variable: 'q' } ] } }),
  { or: [
    { not: { variable: 'p' } },
    { not: { variable: 'q' } } ] })

assert.deepEqual(
  normalize(
    { not: {
        not: { variable: 'p' } } }),
  { variable: 'p' })

assert.deepEqual(
  normalize(
    { or: [
        { variable: 'p' },
        { and: [
            { variable: 'q' },
            { variable: 'r' } ] } ] }),
  { and: [
      { or: [
          { variable: 'p' },
          { variable: 'q' } ] },
      { or: [
          { variable: 'q' },
          { variable: 'r' } ] } ] })

assert.deepEqual(
  normalize(
    { or: [
        { and: [
            { variable: 'q' },
            { variable: 'r' } ] },
        { variable: 'p' } ] }),
  { and: [
      { or: [
          { variable: 'p' },
          { variable: 'q' } ] },
      { or: [
          { variable: 'q' },
          { variable: 'r' } ] } ] })
```
