import {curry, functionName} from "./curry.js"
import {firstOf, lastOf} from "./indexables.js"
import {isBlank} from "./predicates.js"

export function pretty(x) {
  if (typeof x === "function") {
    if (x.partialArgs) {
      return `${functionName(x)}(${x.partialArgs.map(pretty).join(", ")})`
    } else {
      return functionName(x)
    }
  }
  if (typeof x === "string") {
    return `"${x}"`
  }
  return String(x)
}

export function indent(level, s) {
  return s.split("\n")
    .map(prefix(repeat(level, " ")))
    .join("\n")
}

export function toLines(...strs) {
  return strs.join("\n")
}

export function repeat(n, s) {
  return Array(n + 1).join(s)
}

const prefix = pref => s => pref + s

export const removePrefix = curry(
  function removePrefix(prefix, s) {
    const hasPrefix = s.slice(0, prefix.length) === prefix
    return hasPrefix ? s.slice(prefix.length) : s
  })

export function lines(s) {
  return String(s).split(/\r?\n/)
}

export function trimMargin(s) {
  const lns = lines(s)
  if (isBlank(firstOf(lns))) lns.shift()
  if (isBlank( lastOf(lns))) lns.pop()
  const initialIndent = /^[ \t]*/.exec(firstOf(lns))[0]
  return lns
    .map(removePrefix(initialIndent))
    .join("\n")
}
