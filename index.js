var bifurcate = require('boolean-json-bifurcate')

module.exports = function booleanJSONCNF (expression) {
  // Since boolean-json-schama@3.0.0, conjunctions and disjunctions can
  // contain more than two operands. This makes entering data more
  // user-friendly.
  //
  // For example, `{ and: [ 'p', 'q', 'r' ] }` is now valid Boolean
  // JSON, where that would have to be expressed
  // `{ and: [ 'p', { and: [ 'q', 'r' ] } ] }`
  // prior to 3.0.0.
  //
  // To end up with unambiguous CNF, first "bifurcate" the expression,
  // which is to say convert all conjunctions and disjunctions with more
  // than two operands to compound statements of two operands each.
  //
  // For example, bifurcation converts `{ or: [ 'p', 'q', 'r' ] }`
  // to `{ or: [ 'p', { or: [ 'q', 'r' ] } ] }`.
  return normalize(bifurcate(expression))
}

function normalize (expression) {
  var p, q, r

  // De Morgan's Laws

  // Negation of a Disjunction
  // ¬(p ∨ q) ⇔ (p ∧ q)
  if (
    negation(expression) &&
    !variable(expression.not) &&
    disjunction(expression.not)
  ) {
    p = normalize(expression.not.or[0])
    q = normalize(expression.not.or[1])
    return {
      and: [
        normalize({not: p}),
        normalize({not: q})
      ]
    }

  // Negation of a Conjunction
  // ¬(p ∧ q) ⇔ (p ∨ q)
  } else if (
    negation(expression) &&
    !variable(expression.not) &&
    conjunction(expression.not)
  ) {
    p = normalize(expression.not.and[0])
    q = normalize(expression.not.and[1])
    return {
      or: [
        normalize({not: p}),
        normalize({not: q})
      ]
    }

  // Double Negation
  // (¬¬p) ⇔ (p)
  } else if (
    negation(expression) &&
    !variable(expression.not) &&
    negation(expression.not)
  ) {
    return normalize(expression.not.not)

  // Distribution of Disjunction Over Conjunction

  // Conjunction First
  // ((q ∧ r) ∨ p) ⇔ ((p ∨ q) ∧ (p ∨ r))
  } else if (
    disjunction(expression) &&
    !variable(expression.or[0]) &&
    conjunction(expression.or[0])
  ) {
    p = normalize(expression.or[1])
    q = normalize(expression.or[0].and[0])
    r = normalize(expression.or[0].and[1])
    return {
      and: [
        normalize({or: [p, q]}),
        normalize({or: [p, r]})
      ]
    }

  // Conjunction Second
  // (p ∨ (q ∧ r)) ⇔ ((p ∨ q) ∧ (p ∨ r))
  } else if (
    disjunction(expression) &&
    !variable(expression.or[1]) &&
    conjunction(expression.or[1])
  ) {
    p = normalize(expression.or[0])
    q = normalize(expression.or[1].and[0])
    r = normalize(expression.or[1].and[1])
    return {
      and: [
        normalize({or: [p, q]}),
        normalize({or: [p, r]})
      ]
    }

  // Simple statements pass through.
  } else {
    return expression
  }
}

function conjunction (argument) {
  return (
    typeof argument === 'object' &&
    'and' in argument
  )
}

function disjunction (argument) {
  return (
    typeof argument === 'object' &&
    'or' in argument
  )
}

function negation (argument) {
  return (
    typeof argument === 'object' &&
    'not' in argument
  )
}

function variable (expression) {
  return (
    !conjunction(expression) &&
    !disjunction(expression) &&
    !negation(expression)
  )
}
