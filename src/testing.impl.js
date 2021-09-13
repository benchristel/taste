import {prettyFunctionName} from "./formatting.impl.js"

const suite = createSuite()

export const {getAllTests} = suite

export function test(...args) {
  if (typeof process === "undefined" || process.env.NODE_ENV !== "production")
    suite.test(...args)
}

export function createSuite() {
  const testCases = []

  return {test, getAllTests}

  function test(subject, definitions) {
    testCases.push(
      ...Object.entries(definitions)
        .map(([behavior, fn]) =>
          TestCase(`${subject} ${behavior}`, fn))
    )
  }

  function getAllTests() {
    return testCases
  }
}

export function expect(subject, expectation, ...args) {
  const pass = expectation(...args, subject)
  // if the expectation returns a function, that's almost
  // certainly a mistake on the part of the test-writer.
  // Possibly they forgot to pass all needed arguments to
  // a curried function.
  if (typeof pass === "function") {
    throw new Error("The matcher function `" + prettyFunctionName(pass) + "` returned a function instead of a boolean. You might need to pass another argument to it.")
  }
  if (!pass) {
    throw {
      isExpectationFailure: true,
      subject,
      expectation,
      args,
    }
  }
}

function TestCase(title, fn) {
  return {title, fn}
}
