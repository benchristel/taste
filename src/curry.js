const originalFunctionKey = Symbol()
const curriedFunctionKey = Symbol()
const partialArgsKey = Symbol()
const nameKey = Symbol()

export function curry(f, name) {
  function curried(...args) {
    if (args.length >= f.length) {
      return f(...args)
    } else {
      const f2 = (...moreArgs) => curried(...args, ...moreArgs)
      f2[originalFunctionKey] = f
      f2[curriedFunctionKey] = curried
      f2[partialArgsKey] = args
      f2[nameKey] = curried[nameKey]
      return f2
    }
  }

  curried[originalFunctionKey] = f
  curried[curriedFunctionKey] = curried
  curried[partialArgsKey] = []
  curried[nameKey] = name || functionName(f)
  return curried
}

export function originalFunction(f) {
  return f[originalFunctionKey]
}

export function curriedFunction(f) {
  return f[curriedFunctionKey]
}

export function partialArgs(f) {
  return f[partialArgsKey] || []
}

export function functionName(f) {
  return f[nameKey] || f.name
}
