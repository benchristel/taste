export {runTests} from "./test-runner.impl.js"
import {runTests, debugLogs} from "./test-runner.impl.js"

import {curry} from "./curry.js"
import {test, expect, ExpectationFailure} from "./testing.js"
import {is, not, equals, which} from "./predicates.js"
import {trimMargin} from "./formatting.js"

function isDefined(x) {
  return typeof x !== "undefined"
}

const isExpectationFailure = curry(
  function isExpectationFailure(args, error) {
    return error instanceof ExpectationFailure &&
      equals(args, error.expectArgs)
  })

test("runTests", {
  "given no tests"() {
    expect(runTests([]), equals, {
      results: [],
    })
  },

  "given a passing test"() {
    const dummyTestFn = () => {}
    const {results} = runTests([
      {
        subject: "a thing",
        scenario: "does something",
        fn: dummyTestFn,
      },
    ])
    expect(results, equals, [
      {
        test: {
          subject: "a thing",
          scenario: "does something",
          fn: dummyTestFn,
        },
        error: undefined,
        instrumentLog: [],
      }
    ])
  },

  "given a failing test"() {
    const {results} = runTests([
      {
        subject: "a thing",
        scenario: "does something",
        fn() { expect(false, is, true) },
      },
    ])
    expect(results, equals, [
      {
        test: which(isDefined),
        error: which(isExpectationFailure([false, is, true])),
        instrumentLog: [],
      }
    ])
  },

  "given a test that debugs"() {
    const {results} = runTests([
      {
        subject: "a thing",
        scenario: "does something",
        fn() {
          debug("hello", "there")
          debug("another")
        },
      },
    ])
    expect(results, equals, [
      {
        test: which(isDefined),
        error: undefined,
        instrumentLog: [
          {
            type: "debug",
            args: ["hello", "there"]
          },
          {
            type: "debug",
            args: ["another"]
          },
        ],
      }
    ])
    debugLogs.length = 0
  }
})

test("debug logging", {
  "logs all args passed"() {
    debug("arg 1", "arg 2")
    expect(debugLogs, equals, [["arg 1", "arg 2"]])
    debugLogs.length = 0
  }
})
