import {functionName} from "./curry.js"

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
