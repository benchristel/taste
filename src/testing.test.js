import {expect, createSuite, test} from "./testing.impl.js"

function is(a, b) {
  return a === b
}

function isEmpty(a) {
  return a.length === 0
}

function isOne(x) {
  return x === 1
}

test("expect", {
  "doesn't throw if the expectation is met"() {
    expect(1, isOne)
  },

  "throws if the expectation isn't met"() {
    let caught;
    try {
      expect(2, isOne)
    } catch (e) {
      caught = e
    }
    if (!caught) throw new Error("nothing thrown")
  },

  "passes extra args to the expectation"() {
    expect(1, is, 1)
  },

  "works with asymmetric comparisons"() {
    const greaterThan = (a, b) => b > a
    const greaterThanCurried = a => b => greaterThan(a, b)
    expect(2, greaterThan, 1)
    expect(2, greaterThanCurried(1))
  },

  "throws if extra args don't meet the expectation"() {
    let caught;
    try {
      expect(2, is, 1)
    } catch (e) {
      caught = e
    }
    if (!caught) throw new Error("nothing thrown")
  },

  "throws if you forget part of the assertion"() {
    const curriedIs = a => b => a === b
    let caught;
    try {
      expect(1, curriedIs)
    } catch (e) {
      caught = e
    }
    if (!caught) throw new Error("nothing thrown")
    expect(
      caught.message,
      is,
      "The matcher function `<function>` returned a function instead of a boolean. You might need to pass another argument to it.",
    )
  }
})

test("a suite", {
  "starts with no tests"() {
    expect(createSuite().getAllTests(), isEmpty)
  },

  "registers tests independently of other suites"() {
    const theSuite = createSuite()
    theSuite.test("some object", {
      "does something"() {},
    })
    const firstTest = theSuite.getAllTests()[0]
    expect(
      firstTest.subject,
      is, "some object"
    )
    expect(
      firstTest.scenario,
      is, "does something"
    )
    const aDifferentSuite = createSuite()
    expect(aDifferentSuite.getAllTests(), isEmpty)
  },
})
