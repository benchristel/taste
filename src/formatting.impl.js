import {curry, partialArgs, functionName} from "./curry.js"
import {firstOf, lastOf} from "./indexables.js"
import {isBlank} from "./predicates.js"

export function prettyFunctionName(f) {
  return functionName(f) || "<function>"
}

export function pretty(x) {
  const stack = []
  return _pretty(x)

  function _pretty(x) {
    if (null === x)
      return "null"
    if ("function" === typeof x)
      return preventInfiniteLoop(x, prettyFunction)
    if ("string" === typeof x)
      return quote(x)
    if ("bigint" === typeof x)
      return `${x}n`
    if (Array.isArray(x))
      return preventInfiniteLoop(x, prettyArray)
    if (x instanceof Date)
      return `Date(${x.toISOString().replace("T", " ").replace("Z", " UTC")})`
    if (x instanceof RegExp)
      return String(x)
    if (x instanceof Error)
      return `${prettyConstructor(x)}(${quote(x.message)})`
    if (x && Object === x.__proto__.constructor)
      return preventInfiniteLoop(x, prettyObject)
    if ("object" === typeof x)
      return `${prettyConstructor(x)} ${preventInfiniteLoop(x, prettyObject)}`
    return String(x)
  }

  function preventInfiniteLoop(x, cb) {
    if (stack.indexOf(x) > -1) return "<circular reference>"
    stack.push(x)
    const result = cb(x)
    stack.pop()
    return result
  }

  function prettyFunction(f) {
    if (partialArgs(f).length) {
      return `${prettyFunctionName(f)}(${partialArgs(f).map(_pretty).join(", ")})`
    } else {
      return prettyFunctionName(f)
    }
  }

  function prettyArray(a) {
    const innards = a.map(_pretty)
    if (a.length < 2) {
      return "[" + innards + "]"
    } else {
      return "[\n"
        + indent(2, innards.join(",\n"))
        + "\n]"
    }
  }

  function prettyObject(x) {
    const entries = Object.entries(x)
    const innards = entries.map(([k, v]) => `${prettyKey(k)}: ${_pretty(v)}`)
    if (entries.length < 2) {
      return "{" + innards + "}"
    } else {
      return "{\n" + indent(2, innards.join(",\n")) + "\n}"
    }
  }
}

function prettyKey(k) {
  return /^[a-zA-Z0-9_$]+$/.test(k) ? k : quote(k)
}

function prettyConstructor(obj) {
  return prettyFunctionName(obj.__proto__.constructor)
}

export function quote(s) {
  return '"' + String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"')
    .replace(/[\x00-\x1f\x7f]/g, hexEscape)
    + '"'
}

export function hexEscape(c) {
  const hex = c.charCodeAt(0).toString(16)
  return "\\x" + (hex.length < 2 ? "0" + hex : hex)
}

export function indent(level, s) {
  return s.split("\n")
    .map(l => !l ? l : prefix(repeat(level, " "))(l))
    .join("\n")
}

export function toLines(...strs) {
  return strs.map(suffix("\n")).join("")
}

export function repeat(n, s) {
  return Array(n + 1).join(s)
}

const prefix = pref => s => pref + s

const suffix = suf => s => s + suf

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
