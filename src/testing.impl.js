export const {test, getAllTests} = createSuite()

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
  if (!pass || typeof pass === "function") {
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
