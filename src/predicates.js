import {$getBoundArguments, $unapplied} from "@longlast/symbols"
import {equalsWith} from "@longlast/equals"
import {getBoundArguments} from "@longlast/function-provenance"
import {curry} from "./curry.js"

export const which = curry(function(predicate, x) {
  return predicate(x)
}, "which")

export const equals = equalsWith({
  override(a, b) {
    if (typeof a === "function" && a[$unapplied] === which) {
      return getBoundArguments(a).length === 1 && a(b)
    }
  }
})

equals.displayName = "equals"
equals[$getBoundArguments] = () => []

export const is = curry(function(a, b) {
  return a === b
}, "is")

export const not = curry(function(predicate, subject, ...args) {
  return !predicate(subject, ...args)
}, "not")

export const isBlank = curry(function(s) {
  return /^\s*$/.test(s)
}, "isBlank")
