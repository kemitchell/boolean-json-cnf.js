module.exports = booleanJSONCNF

var bifurcate = require('boolean-json-bifurcate')

function booleanJSONCNF(expression) {
  return normalize(bifurcate(expression)) }

function normalize(expression) {
  var p, q, r

  if (isAVariable(expression)) {
    return expression }

  // De Morgan's
  // ¬(p ∨ q) ⇔ (p ∧ q)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'or' in expression.not )
  { p = normalize(expression.not.or[0])
    q = normalize(expression.not.or[1])
    return {
      and: [
        normalize({ not: p }),
        normalize({ not: q }) ] } }

  // De Morgan's
  // ¬(p ∧ q) ⇔ (p ∨ q)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'and' in expression.not )
  { p = normalize(expression.not.and[0])
    q = normalize(expression.not.and[1])
    return {
      or: [
        normalize({ not: p }),
        normalize({ not: q }) ] } }

  // Double Negation
  // (¬¬p) ⇔ (p)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'not' in expression.not )
  { p = normalize(expression.not.not)
    return p }

  // Distribution
  // (p ∨ (q ∧ r)) ⇔ ((p ∨ q) ∧ (p ∨ r))
  else if (
    'or' in expression &&
    !isAVariable(expression.or[0]) &&
    'and' in expression.or[0] )
  { q = normalize(expression.or[0].and[0])
    r = normalize(expression.or[0].and[1])
    p = normalize(expression.or[1])
    return {
      and: [
        normalize({ or: [ p, q ] }),
        normalize({ or: [ p, r ] }) ] } }

  // Distribution
  // ((q ∧ r) ∨ p) ⇔ ((p ∨ q) ∧ (p ∨ r))
  else if (
    'or' in expression &&
    !isAVariable(expression.or[1]) &&
    'and' in expression.or[1] )
  { p = normalize(expression.or[0])
    q = normalize(expression.or[1].and[0])
    r = normalize(expression.or[1].and[1])
    return {
      and: [
        normalize({ or: [ p, q ] }),
        normalize({ or: [ p, r ] }) ] } }

  else {
    return expression } }

function isAVariable(expression) {
  return ( typeof expression === 'string' ) }
