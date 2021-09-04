export {is, not, isBlank} from "./predicates.impl.js"
import {is, not} from "./predicates.impl.js"

import {test, expect} from "./testing.js"

const eq = (a, b) => a === b

test("is", {
  "returns true if its args are equal"() {
    expect(is(1, 1), eq, true)
  },

  "returns false if its args are unequal"() {
    expect(is(1, 2), eq, false)
    expect(is(2, 1), eq, false)
  },

  "performs exact comparison"() {
    expect(is(1, "1"), eq, false)
    expect(is("1", 1), eq, false)
  },

  "compares by pointer equality"() {
    expect(is({}, {}), eq, false)
  },
})

test("not", {
  "inverts the given predicate"() {
    expect(not(is(1))(2), eq, true)
    expect(not(is(1))(1), eq, false)
  },

  "inverts twice"() {
    expect(1, not(not(is(1))))
  }
})
