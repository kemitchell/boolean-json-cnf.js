function isAVariable(expression) {
  return ( typeof expression === 'string' ) }

function booleanJSONCNF(expression) {
  var p, q, r

  if (isAVariable(expression)) {
    return expression }

  // De Morgan's
  // ¬(p ∨ q) ⇔ (p ∧ q)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'or' in expression.not )
  { p = booleanJSONCNF(expression.not.or[0])
    q = booleanJSONCNF(expression.not.or[1])
    return {
      and: [
        { not: p },
        { not: q } ] } }

  // De Morgan's
  // ¬(p ∧ q) ⇔ (p ∨ q)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'and' in expression.not )
  { p = booleanJSONCNF(expression.not.and[0])
    q = booleanJSONCNF(expression.not.and[1])
    return {
      or: [
        { not: p },
        { not: q } ] } }

  // Double Negation
  // (¬¬p) ⇔ (p)
  else if (
    'not' in expression &&
    !isAVariable(expression.not) &&
    'not' in expression.not )
  { p = booleanJSONCNF(expression.not.not)
    return p }

  // Distribution
  // (p ∨ (q ∧ r)) ⇔ ((p ∨ q) ∧ (q ∨ r))
  else if (
    'or' in expression &&
    !isAVariable(expression.or[0]) &&
    'and' in expression.or[0] )
  { q = booleanJSONCNF(expression.or[0].and[0])
    r = booleanJSONCNF(expression.or[0].and[1])
    p = booleanJSONCNF(expression.or[1])
    return {
      and: [
        { or: [ p, q ] },
        { or: [ q, r ] } ] } }

  // Distribution
  // ((q ∧ r) ∨ p) ⇔ ((p ∨ q) ∧ (q ∨ r))
  else if (
    'or' in expression &&
    !isAVariable(expression.or[1]) &&
    'and' in expression.or[1] )
  { p = booleanJSONCNF(expression.or[0])
    q = booleanJSONCNF(expression.or[1].and[0])
    r = booleanJSONCNF(expression.or[1].and[1])
    return {
      and: [
        { or: [ p, q ] },
        { or: [ q, r ] } ] } }

  else {
    return expression } }

module.exports = booleanJSONCNF
