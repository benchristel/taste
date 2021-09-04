import {curry} from "./curry.js"

export const is = curry(function is(a, b) {
  return a === b
})

export const not = curry(function not(predicate, subject) {
  return !predicate(subject)
})

export function isBlank(s) {
  return /^\s*$/.test(s)
}
