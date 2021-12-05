import {curry, curriedFunction, partialArgs, originalFunction} from "./curry.js"

export const which = curry(function(predicate, x) {
  return predicate(x)
}, "which")

export const equals = curry(function(a, b) {
  if (isCustomMatcher(a)) {
    return a(b)
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length
      && a.every((_, i) => equals(a[i], b[i]))
  }
  if (a instanceof Function && b instanceof Function) {
    if (originalFunction(a) && originalFunction(a) === originalFunction(b)) {
      return equals(partialArgs(a), partialArgs(b))
    }
    return a === b
  }
  if (a instanceof Date && b instanceof Date) {
    return a.toISOString() === b.toISOString()
  }
  if (a instanceof Set && b instanceof Set) {
    return a.size === b.size
      && [...a.values()].every(v => b.has(v))
  }
  if (a instanceof Object && b instanceof Object) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    return aKeys.length === bKeys.length
      && aKeys.every(k => equals(a[k], b[k]))
      && a.__proto__.constructor === b.__proto__.constructor
  }
  return a === b
}, "equals")

export const is = curry(function(a, b) {
  return a === b
}, "is")

export const not = curry(function(predicate, subject, ...args) {
  return !predicate(subject, ...args)
}, "not")

export const isBlank = curry(function(s) {
  return /^\s*$/.test(s)
}, "isBlank")

function isCustomMatcher(f) {
  return f instanceof Function
    && curriedFunction(f) === which
    && partialArgs(f).length === 1
}
