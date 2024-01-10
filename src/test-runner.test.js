import {runTests, debug, debugLogs} from "./test-runner.js"

import {curry} from "./curry.js"
import {test, expect, ExpectationFailure} from "./testing.js"
import {is, equals, which} from "./predicates.js"

function isDefined(x) {
  return typeof x !== "undefined"
}

const isExpectationFailure = curry(
  function isExpectationFailure(args, error) {
    return error instanceof ExpectationFailure &&
      equals(args, error.expectArgs)
  })

test("runTests", {
  async "given no tests"() {
    expect(await runTests([]), equals, {
      results: [],
    })
  },

  async "given a passing test"() {
    const dummyTestFn = () => {}
    const {results} = await runTests([
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

  async "given a failing test"() {
    const {results} = await runTests([
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

  async "given a test that debugs"() {
    const {results} = await runTests([
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
  },

  async "given an async test that debugs"() {
    const {results} = await runTests([
      {
        subject: "a thing",
        scenario: "does something",
        async fn() {
          debug("before await")
          await Promise.resolve()
          debug("after await")
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
            args: ["before await"]
          },
          {
            type: "debug",
            args: ["after await"]
          },
        ],
      }
    ])
  }
})

test("debug logging", {
  "logs all args passed"() {
    debug("arg 1", "arg 2")
    expect(debugLogs, equals, [["arg 1", "arg 2"]])
    debugLogs.length = 0
  }
})
