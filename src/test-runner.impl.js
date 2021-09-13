import {pretty, indent, toLines, trimMargin} from "./formatting.js"

export function runTests(testCases) {
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
  return failures.join("\n") + "\nTests failed."
}

export function reportsFailure(testOutput) {
  return /fail/i.test(testOutput)
}

export const debugLogs = []
window.debug = (...args) => debugLogs.push(args)

export function run(testCase) {
  const {title, fn} = testCase
  let caught
  try {
    debugLogs.length = 0
    fn()
  } catch (e) {
    caught = e
  }
  if (caught || debugLogs.length) {
    const sections = [title + "\n"]
    if (debugLogs.length)
      sections.push(indent(2, formatDebugLog(debugLogs)))
    if (caught)
      sections.push(indent(2, formatFailureMessage(caught)))
    return sections.join("")
  }
  return ""
}

export function formatFailureMessage(error) {
  if (error.isExpectationFailure) {
    return formatFunctionCall(
      "expect",
      [
        error.subject,
        error.expectation,
        ...error.args,
      ]
    )
  }
  return pretty(error) + " thrown\n"
    + indent(2, simplifyStacktrace(error.stack))
}

function simplifyStacktrace(stack) {
  if (!stack) return ""
  const lines = trimMargin(stack).split("\n")
  return lines.slice(0, lines.length - 3)
    .map(line =>
      line
        .replace(/(file:\/\/|http:\/\/[^/]*)/, "")
        .replace(/^([^@]*)@(.*)$/, "at $1 ($2)")
    )
    .join("\n") + "\n"
}

export function formatDebugLog(log) {
  return log
    .map(args => formatFunctionCall("debug", args))
    .join("")
}

export function formatFunctionCall(name, args) {
  return toLines(
    name + "(",
    ...args.map(x => indent(2, pretty(x)) + ","),
    ")"
  )
}
