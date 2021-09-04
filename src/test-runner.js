export {runTests} from "./test-runner.impl.js"
import {runTests, successMessage} from "./test-runner.impl.js"

import {test, expect} from "./testing.js"
import {is} from "./predicates.js"
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
