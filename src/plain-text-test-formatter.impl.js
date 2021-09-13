import {trimMargin, indent, formatStructure, pretty} from "./formatting.js"
import {ExpectationFailure} from "./testing.js"

const blankLine = "\n\n"

export function formatTestResultsAsText({results}) {
  let anyErrors = false
  let anyInstrumentation = false
  let resultsNeedingAttention = []
  for (const r of results) {
    let needsAttention = false
    if (r.error) {
      needsAttention = anyErrors = true
    }
    if (r.instrumentLog.length) {
      needsAttention = anyInstrumentation = true
    }
    if (needsAttention) {
      resultsNeedingAttention.push(r)
    }
  }
  if (anyErrors) {
    return suiteFailed(resultsNeedingAttention)
  }
  if (anyInstrumentation) {
    return suitePassedWithInstrumentation(
      results.length,
      resultsNeedingAttention,
    )
  }
  return suitePassed(results.length)
}

export function reportsFailure(testOutput) {
  return /fail/i.test(testOutput)
}

export function suiteFailed(failures) {
  return failures
    .map(formatFailure)
    .join(blankLine)
    + blankLine + "Tests failed."
}

export function suitePassed(numPassed) {
  switch (numPassed) {
    case 0: return "No tests to run."
    case 1: return "One test ran, and found no issues."
    default: return `${numPassed} tests ran, and found no issues.`
  }
}

export function suitePassedWithInstrumentation(numPassed, resultsWithLogs) {
  return resultsWithLogs
    .map(formatFailure)
    .join(blankLine)
    + blankLine
    + countPasses(numPassed) + ", but debugging instrumentation is present.\n"
    + "Remove it before shipping."
}

export function countPasses(n) {
  switch (n) {
    case 1: return "The test passed"
    case 2: return "Both tests passed"
    default: return `All ${n} tests passed`
  }
}

export function formatFailure({test, error, instrumentLog}) {
  const title = test.subject + " " + test.scenario
  const sections = [title]
  if (instrumentLog.length)
    sections.push(indent(2, formatDebugLog(instrumentLog)))
  if (error)
    sections.push(indent(2, formatError(error)))
  return sections.join("\n")
}

export function formatError(error) {
  return error instanceof ExpectationFailure
    ? formatExpectationFailure(error)
    : formatException(error)
}

export function formatDebugLog(log) {
  return log
    .map(({args}) => formatFunctionCall("debug", args))
    .join("")
}

export function formatExpectationFailure(error) {
  return formatFunctionCall(
    "expect",
    error.expectArgs
  )
}

export function formatException(error) {
  return pretty(error) + " thrown"
    + indent(2, simplifyStacktrace(error.stack))
}

export function formatFunctionCall(name, args) {
  return formatStructure(name + "(", args.map(pretty), ",", ")")
}

export function simplifyStacktrace(stack) {
  if (!stack) return ""
  const lines = trimMargin(stack).split("\n")
  return "\n"
    + lines.slice(0, lines.findIndex(l => l.includes("errorFrom")))
      .map(line =>
        line
          .replace(/(file:\/\/|http:\/\/[^/]*)/, "")
          .replace(/^([^@]*)@(.*)$/, "at $1 ($2)")
      )
      .join("\n")
}
