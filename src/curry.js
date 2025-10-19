import {curry as longlastCurry} from "@longlast/curry"
import {$unapplied, $getBoundArguments} from "@longlast/symbols"

export function curry(f, name) {
  const curried = longlastCurry(f)
  curried.displayName = name || functionName(f)
  return curried
}

export function originalFunction(f) {
  return f[$unapplied]
}

export function partialArgs(f) {
  return f[$getBoundArguments]?.() ?? []
}

export function functionName(f) {
  return f.displayName || f.name
}
