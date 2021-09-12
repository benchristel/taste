import {curry} from "./curry.js"

export const equals = curry(function equals(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length
      && a.every((_, i) => equals(a[i], b[i]))
  }
  if (a instanceof Function && b instanceof Function) {
    if (a.originalFunction && a.originalFunction === b.originalFunction) {
      return equals(a.partialArgs, b.partialArgs)
    }
    return a === b
  }
  if (a instanceof Date && b instanceof Date) {
    return a.toISOString() === b.toISOString()
  }
  if (a instanceof Object && b instanceof Object) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    return aKeys.length === bKeys.length
      && aKeys.every(k => equals(a[k], b[k]))
      && a.__proto__.constructor === b.__proto__.constructor
  }
  return a === b
})

export const is = curry(function is(a, b) {
  return a === b
})

export const not = curry(function not(predicate, subject) {
  return !predicate(subject)
})

export function isBlank(s) {
  return /^\s*$/.test(s)
}
