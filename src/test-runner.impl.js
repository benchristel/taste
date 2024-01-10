export async function runTests(tests) {
  const results = []
  for (const test of tests) {
    const error = await errorFrom(test.fn)
    const instrumentLog = debugLogs.map(args => ({type: "debug", args}))
    debugLogs.length = 0
    results.push({
      test,
      error,
      instrumentLog
    })
  }
  return {results}
}

export function result(test) {
  // WARNING: if you remove the call to errorFrom, you must
  // also update the test result formatter, which uses the
  // errorFrom name to identify the end of the useful
  // stacktrace.
  const errorPromise = errorFrom(test.fn)
  const instrumentLog = debugLogs.map(args => ({type: "debug", args}))
  return errorPromise.then(error => {
    const result = {
      test,
      error,
      instrumentLog,
    }
    return result
  })
}

// WARNING: if you change the name of errorFrom, you must
// also update the test result formatter, which uses the
// errorFrom name to identify the end of the useful
// stacktrace.
export function errorFrom(f) {
  let caught;
  try {
    const result = f()
    if (result instanceof Promise) {
      return new Promise(resolve => {
        result.then(() => resolve()).catch(resolve)
      })
    }
  } catch(e) {
    caught = e
  }
  return Promise.resolve(caught);
}

export const debugLogs = []
export function debug(...args) {
  debugLogs.push(args)
}
