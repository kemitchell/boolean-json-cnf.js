module.exports = booleanJSONCNF

var bifurcate = require('boolean-json-bifurcate')

function booleanJSONCNF(expression) {
  return normalize(bifurcate(expression)) }

function normalize(expression) {
  var p, q, r

  // De Morgan's
  // ¬(p ∨ q) ⇔ (p ∧ q)
  if (
    negation(expression) &&
    !variable(expression.not) &&
    disjunction(expression.not) )
  { p = normalize(expression.not.or[0])
    q = normalize(expression.not.or[1])
    return {
      and: [
        normalize({ not: p }),
        normalize({ not: q }) ] } }

  // De Morgan's
  // ¬(p ∧ q) ⇔ (p ∨ q)
  else if (
    negation(expression) &&
    !variable(expression.not) &&
    conjunction(expression.not) )
  { p = normalize(expression.not.and[0])
    q = normalize(expression.not.and[1])
    return {
      or: [
        normalize({ not: p }),
        normalize({ not: q }) ] } }

  // Double Negation
  // (¬¬p) ⇔ (p)
  else if (
    negation(expression) &&
    !variable(expression.not) &&
    negation(expression.not) )
  { p = normalize(expression.not.not)
    return p }

  // Distribution
  // (p ∨ (q ∧ r)) ⇔ ((p ∨ q) ∧ (p ∨ r))
  else if (
    disjunction(expression) &&
    !variable(expression.or[0]) &&
    conjunction(expression.or[0]) )
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
    disjunction(expression) &&
    !variable(expression.or[1]) &&
    conjunction(expression.or[1]) )
  { p = normalize(expression.or[0])
    q = normalize(expression.or[1].and[0])
    r = normalize(expression.or[1].and[1])
    return {
      and: [
        normalize({ or: [ p, q ] }),
        normalize({ or: [ p, r ] }) ] } }

  else {
    return expression } }

function conjunction(argument) {
  return (
    typeof argument === 'object' &&
    'and' in argument ) }

function disjunction(argument) {
  return (
    typeof argument === 'object' &&
    'or' in argument ) }

function negation(argument) {
  return (
    typeof argument === 'object' &&
    'not' in argument ) }

function variable(expression) {
  return (
    !conjunction(expression) &&
    !disjunction(expression) &&
    !negation(expression) ) }
