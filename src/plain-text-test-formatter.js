export {formatTestResultsAsText, reportsFailure} from "./plain-text-test-formatter.impl.js"

import {formatTestResultsAsText, reportsFailure, formatFunctionCall} from "./plain-text-test-formatter.impl.js"
import {test, expect, ExpectationFailure} from "./testing.js"
import {is, not} from "./predicates.js"
import {trimMargin} from "./formatting.js"

const basePassingTest = Object.freeze({
  test: {
    subject: "a thing",
    scenario: "does something",
    fn() {},
  },
  error: undefined,
  instrumentLog: [],
})

function expectOutput(testResults, expected) {
  expect(
    formatTestResultsAsText({results: testResults}),
    is, expected)
}

test("formatTestResultsAsText", {
  "given no tests"() {
    expectOutput([], "No tests to run.")
  },

  "given one passing test"() {
    expectOutput([basePassingTest],
      "One test ran, and found no issues.")
  },

  "given multiple passing tests"() {
    const testResults = [
      basePassingTest,
      basePassingTest,
    ]
    expectOutput(testResults,
      "2 tests ran, and found no issues.")
  },

  "given a failing test"() {
    const testResults = [
      {
        ...basePassingTest,
        error: new ExpectationFailure([1, is, 2])
      }
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        expect(
          1,
          is,
          2
        )

      Tests failed.
    `)
  },

  "given multiple failing tests"() {
    const testResults = [
      {
        ...basePassingTest,
        error: new ExpectationFailure([1, is, 2])
      },
      {
        ...basePassingTest,
        test: {
          ...basePassingTest.test,
          scenario: "does a second thing"
        },
        error: new ExpectationFailure([3, is, 4])
      }
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        expect(
          1,
          is,
          2
        )

      a thing does a second thing
        expect(
          3,
          is,
          4
        )

      Tests failed.
    `)
  },

  "shows debug logs"() {
    const testResults = [
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["hello"]}
        ]
      }
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        debug("hello")

      The test passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)
  },

  "shows debug logs for two tests"() {
    const testResults = [
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["hello"]}
        ]
      },
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["blah"]}
        ]
      },
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        debug("hello")

      a thing does something
        debug("blah")

      Both tests passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)
  },

  "shows debug logs for three tests"() {
    const testResults = [
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["hello"]}
        ]
      },
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["blah"]}
        ]
      },
      {
        ...basePassingTest,
      },
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        debug("hello")

      a thing does something
        debug("blah")

      All 3 tests passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)
  },

  "shows debug logs in the presence of failures"() {
    const testResults = [
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["hello"]}
        ],
        error: new ExpectationFailure([1, is, 2])
      },
      {
        ...basePassingTest,
        instrumentLog: [
          {type: "debug", args: ["blah"]}
        ]
      },
      {
        ...basePassingTest,
        error: new ExpectationFailure([3, is, 4])
      },
    ]
    expectOutput(testResults, trimMargin`
      a thing does something
        debug("hello")
        expect(
          1,
          is,
          2
        )

      a thing does something
        debug("blah")

      a thing does something
        expect(
          3,
          is,
          4
        )

      Tests failed.
    `)
  },

  "formats an error with a Firefox stacktrace"() {
    const error = new Error("test error")
    // This is a real stacktrace copy-pasted from Firefox
    error.stack = trimMargin`
      kablooie@http://localhost:8080/src/plain-text-test-formatter.js:217:13
      formats an error with a stacktrace@http://localhost:8080/src/plain-text-test-formatter.js:221:7
      errorFrom@http://localhost:8080/src/test-runner.js:15:9
      result@http://localhost:8080/src/test-runner.js:24:26
      runTests@http://localhost:8080/src/test-runner.js:20:26
      runAndFormat@http://localhost:8080/:14:49
      @http://localhost:8080/:17:22
    `
    const testResults = [{...basePassingTest, error}]
    expectOutput(testResults, trimMargin`
      a thing does something
        Error("test error") thrown
          at kablooie (/src/plain-text-test-formatter.js:217:13)
          at formats an error with a stacktrace (/src/plain-text-test-formatter.js:221:7)

      Tests failed.
    `)
  },

  "formats an error with a Chrome stacktrace"() {
    const error = new Error("test error")
    // This is real stacktrace copy-pasted from Chrome.
    error.stack = trimMargin`
      Error: test error
          at repeats a string zero times (formatting.js:14)
          at errorFrom (test-runner.impl.js:42)
          at runTests (test-runner.impl.js:6)
          at async (index):17
    `
    const testResults = [{...basePassingTest, error}]
    expectOutput(testResults, trimMargin`
      a thing does something
        Error("test error") thrown
          Error: test error
              at repeats a string zero times (formatting.js:14)

      Tests failed.
    `)
  },

  "formats an error thrown from async code on Firefox"() {
    const error = new Error("test error")
    // This is a real stacktrace copy-pasted from Firefox
    error.stack = trimMargin`
      repeats a string zero times@http://localhost:8080/src/formatting.js:15:11
      async*errorFrom@http://localhost:8080/src/test-runner.impl.js:42:20
      runTests@http://localhost:8080/src/test-runner.impl.js:6:25
      async*@http://localhost:8080/:17:23
    `
    const testResults = [{...basePassingTest, error}]
    expectOutput(testResults, trimMargin`
      a thing does something
        Error("test error") thrown
          at repeats a string zero times (/src/formatting.js:15:11)

      Tests failed.
    `)
  },

  "formats an error thrown from async code on Chrome"() {
    const error = new Error("test error")
    // This is real stacktrace copy-pasted from Chrome.
    error.stack = trimMargin`
      Error: test error
          at repeats a string zero times (formatting.js:15)
    `
    const testResults = [{...basePassingTest, error}]
    expectOutput(testResults, trimMargin`
      a thing does something
        Error("test error") thrown
          Error: test error
              at repeats a string zero times (formatting.js:15)

      Tests failed.
    `)
  },

  "formats a throwable without a stacktrace"() {
    const testResults = [{...basePassingTest, error: "test error"}]
    expectOutput(testResults, trimMargin`
      a thing does something
        "test error" thrown

      Tests failed.
    `)
  }
})

test("formatFunctionCall", {
  "given no function args"() {
    expect(formatFunctionCall("myFunc", []), is, "myFunc()")
  },

  "given one arg"() {
    expect(formatFunctionCall("myFunc", ["a"]), is, 'myFunc("a")')
  },

  "given multiple args"() {
    expect(formatFunctionCall("myFunc", ["a", "b"]), is, trimMargin`
      myFunc(
        "a",
        "b"
      )
    `)
  },
})

test("reportsFailure", {
  "given success"() {
    expect(reportsFailure("10 tests ran"), is, false)
  },

  "given failure"() {
    expect(reportsFailure("Tests failed"), is, true)
  },

  "matches 'fail' case insensitively"() {
    expect("FAIL", reportsFailure)
    expect("A FAILURE", reportsFailure)
    expect("fail", reportsFailure)
    expect("something failed", reportsFailure)
    expect("f", not(reportsFailure))
  }
})
