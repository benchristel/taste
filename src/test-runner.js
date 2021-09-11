export {runTests, reportsFailure} from "./test-runner.impl.js"
import {runTests, reportsFailure, successMessage, failureMessage} from "./test-runner.impl.js"

import {test, expect} from "./testing.js"
import {is, not} from "./predicates.js"
import {trimMargin} from "./formatting.js"

test("runTests", {
  "given no tests"() {
    expect(runTests([]), is("No tests to run."))
  },

  "given one passing test"() {
    const testCases = [
      {title: "pass", fn() {}},
    ]
    expect(runTests(testCases), is("One test ran, and found no issues."))
  },

  "given one failing test"() {
    const testCases = [
      {
        title: "test title",
        fn() {
          throw new Error("error from test")
        },
      },
    ]
    const expectedMessage = trimMargin`
      test title
        error from test

      Tests failed.
    `
    expect(runTests(testCases), is, expectedMessage)
  },
})

test("successMessage", {
  "for no tests"() {
    expect(successMessage(0), is, "No tests to run.")
  },

  "for one test"() {
    expect(successMessage(1), is, "One test ran, and found no issues.")
  },

  "for two tests"() {
    expect(successMessage(2), is, "2 tests ran, and found no issues.")
  },
})

test("reportsFailure", {
  "given success"() {
    expect(reportsFailure(successMessage(10)), is, false)
  },

  "given failure"() {
    expect(reportsFailure(failureMessage([])), is, true)
  },

  "matches 'fail' case insensitively"() {
    expect("FAIL", reportsFailure)
    expect("A FAILURE", reportsFailure)
    expect("fail", reportsFailure)
    expect("something failed", reportsFailure)
    expect("f", not(reportsFailure))
  }
})
