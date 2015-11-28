module.exports = booleanJSONCNF

function booleanJSONCNF(expression) {
  var p, q, r

  if (isAVariable(expression)) {
    return expression }

  // De Morgan's
  // ¬(p ∨ q) ⇔ (p ∧ q)
  else if (
    isANegation(expression) &&
    !isAVariable(expression.not) &&
    isADisjunction(expression.not) )
  { return {
      and: expression.not.or.map(function(dijunct) {
        return { not: booleanJSONCNF(dijunct) } }) } }

  // De Morgan's
  // ¬(p ∧ q) ⇔ (p ∨ q)
  else if (
    isANegation(expression) &&
    !isAVariable(expression.not) &&
    isAConjunction(expression.not) )
  { return {
      or: expression.not.and.map(function(conjunct) {
        return { not: booleanJSONCNF(conjunct) } }) } }

  // Double Negation
  // (¬¬p) ⇔ (p)
  else if (
    isANegation(expression) &&
    isANegation(expression.not) )
  { return booleanJSONCNF(expression.not.not) }

  // Distribution
  // (p ∨ q ∨ (r ∧ s ∧ t)) ⇔ ((p ∨ q) ∧ (p ∨ r) ∧ (p ∨ s))
  else if (
    isADisjunction(expression) &&
    expression.or.some(function(disjunct) {
      return isAConjunction(disjunct) }) )
  { q = booleanJSONCNF(expression.or[0].and[0])
    r = booleanJSONCNF(expression.or[0].and[1])
    p = booleanJSONCNF(expression.or[1])
    return {
      and: [
        { or: [ p, q ] },
        { or: [ p, r ] } ] } }

  // Distribution
  // ((q ∧ r) ∨ p) ⇔ ((p ∨ q) ∧ (p ∨ r))
  else if (
    isADisjunction(expression) &&
    !isAVariable(expression.or[1]) &&
    'and' in expression.or[1] )
  { p = booleanJSONCNF(expression.or[0])
    q = booleanJSONCNF(expression.or[1].and[0])
    r = booleanJSONCNF(expression.or[1].and[1])
    return {
      and: [
        { or: [ p, q ] },
        { or: [ p, r ] } ] } }

  else {
    return expression } }

function isAVariable(expression) {
  return ( typeof expression === 'string' ) }

function isANegation(expression) {
  return ( 'not' in expression) }

function isADisjunction(expression) {
  return ( 'or' in expression) }

function isAConjunction(expression) {
  return ( 'and' in expression) }
