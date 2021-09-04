export function curry(f, name) {
  const curried = (...args) => partialApply(f, ...args)
  f.prettyName
    = curried.prettyName
    = name || functionName(f)
  return curried
}

export function partialApply(f, ...args) {
  if (args.length >= f.length) {
    return f(...args)
  } else {
    const f2 = (...moreArgs) => partialApply(f, ...args, ...moreArgs)
    f2.originalFunction = f.originalFunction || f
    f2.partialArgs = args
    return f2
  }
}

export function functionName(f) {
  if (f.originalFunction) return functionName(f.originalFunction)
  return f.prettyName || f.name || "<anonymous>"
}
