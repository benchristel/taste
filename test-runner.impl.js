import {allTestCases} from "./testing.js"
import {pretty, indent, toLines} from "./formatting.js"

export function runTests(testCases = allTestCases) {
  const failures = testCases
    .map(run)
    .filter(Boolean)

  if (failures.length === 0) {
    return successMessage(testCases.length)
  } else {
    return failureMessage(failures)
  }
}

export function successMessage(numSuccesses) {
  switch (numSuccesses) {
    case 0: return "No tests to run."
    case 1: return "One test ran, and found no issues."
    default: return `${numSuccesses} tests ran, and found no issues.`
  }
}

export function failureMessage(failures) {
  return failures.join("\n\n") + "\n\nTests failed."
}

export function run(testCase) {
  const {title, fn} = testCase
  try {
    fn()
  } catch (e) {
    return title + "\n" + indent(2, formatFailureMessage(e))
  }
  return ""
}

export function formatFailureMessage(error) {
  if (error.isExpectationFailure) {
    return formatExpectationFailure(
      error.subject,
      error.expectation,
      ...error.args,
    )
  }
  return error.message
}

export function formatExpectationFailure(...args) {
  return toLines(
    "expect(",
    ...args.map(a => indent(2, pretty(a) + ",")),
    ")"
  )
}
