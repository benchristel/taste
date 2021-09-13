import {pretty, indent, toLines, trimMargin, formatStructure} from "./formatting.js"

export function runTests(tests) {
  return {results: tests.map(result)}
}

export function result(test) {
  // WARNING: if you remove the call to errorFrom, you must
  // also update the test result formatter, which uses the
  // errorFrom name to identify the end of the useful
  // stacktrace.
  const error = errorFrom(test.fn)
  const result = {
    test,
    error,
    instrumentLog: debugLogs.map(args => ({type: "debug", args})),
  }
  debugLogs.length = 0
  return result
}

// WARNING: if you change the name of errorFrom, you must
// also update the test result formatter, which uses the
// errorFrom name to identify the end of the useful
// stacktrace.
export function errorFrom(f) {
  let caught;
  try { f() } catch(e) { caught = e }
  return caught;
}

export const debugLogs = []
window.debug = (...args) => debugLogs.push(args)
