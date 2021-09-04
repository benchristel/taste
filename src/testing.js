export {test, expect, allTestCases} from "./testing.impl.js"
import {test, expect, allTestCases} from "./testing.impl.js"

function is(a, b) {
  return a === b
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

  "throws if extra args don't meet the expectation"() {
    let caught;
    try {
      expect(2, is, 1)
    } catch (e) {
      caught = e
    }
    if (!caught) throw new Error("nothing thrown")
  },
})
