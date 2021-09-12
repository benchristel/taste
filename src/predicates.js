export {is, not, equals, isBlank} from "./predicates.impl.js"
import {is, not, equals} from "./predicates.impl.js"

import {test, expect} from "./testing.js"

const eq = (a, b) => a === b

test("equals", {
  "compares primitives"() {
    expect(equals(1, 1), is, true)
    expect(equals(1, 2), is, false)
  },

  "compares nulls"() {
    expect(equals(null, null), is, true)
  },

  "compares undefineds"() {
    expect(equals(undefined, undefined), is, true)
  },

  "treats null and undefined as different"() {
    expect(equals(null, undefined), is, false)
  },

  "compares bigints"() {
    expect(equals(10n, 99n), is, false)
    expect(equals(10n, 10n), is, true)
  },

  "compares bigints to numbers"() {
    expect(equals(10n, 10), is, false)
  },

  "is curried"() {
    expect(1, equals(1))
    expect(1, not(equals(2)))
  },

  "given empty arrays"() {
    expect([], equals, [])
  },

  "given arrays of different lengths"() {
    expect([1], not(equals([])))
    expect([], not(equals([1])))
  },

  "given arrays with different elements"() {
    expect([1], not(equals([2])))
  },

  "given equal arrays"() {
    expect([1, 2, 3], equals, [1, 2, 3])
  },

  "given equal nested arrays"() {
    expect([1, [2, 3], 4], equals, [1, [2, 3], 4])
  },

  "given unequal nested arrays"() {
    expect([1, [2, 5], 4], not(equals([1, [2, 3], 4])))
  },

  "given an array and a non-array"() {
    expect([1], not(equals(null)))
    expect(null, not(equals([1])))
  },

  "given empty objects"() {
    expect({}, equals, {})
  },

  "given objects with different numbers of keys"() {
    expect({foo: 1}, not(equals({})))
    expect({}, not(equals({foo: 1})))
  },

  "given objects with different sets of keys"() {
    expect({foo: 1}, not(equals({bar: 1})))
    expect({bar: 1}, not(equals({foo: 1})))
  },

  "given objects with the same keys but different values"() {
    expect({foo: 1}, not(equals({foo: 2})))
  },

  "given equal objects"() {
    expect({foo: 1, bar: 2}, equals({foo: 1, bar: 2}))
  },

  "doesn't care about key order"() {
    expect({bar: 2, foo: 1}, equals({foo: 1, bar: 2}))
  },

  "deep-compares objects"() {
    expect({bar: {foo: 1}}, equals({bar: {foo: 1}}))
  },

  "given classes"() {
    class ClassOne {}
    class ClassTwo {}
    expect(ClassOne, equals, ClassOne)
    expect(ClassTwo, not(equals(ClassOne)))
  },

  "given instances of different classes"() {
    class ClassOne {}
    class ClassTwo {}
    expect(new ClassOne(), not(equals(new ClassTwo())))
  },

  "given a subclass instance and a superclass instance"() {
    class Superclass {}
    class Subclass extends Superclass {}
    expect(new Superclass(), not(equals(new Subclass())))
    expect(new Subclass(), not(equals(new Superclass())))
  },

  "given different functions"() {
    expect(() => {}, not(equals(() => {})))
  },

  "given the same function"() {
    expect(equals, equals, equals)
  },

  "given partially applied functions with equal arguments"() {
    expect(equals({foo: 1}), equals, equals({foo: 1}))
  },

  "given partially applied functions with different arguments"() {
    expect(equals({foo: 2}), not(equals(equals({foo: 1}))))
  },

  "given different dates"() {
    expect(new Date("1999-12-21"), not(equals(new Date("2001-12-22"))))
  },

  "given equal dates"() {
    expect(new Date("1999-12-21"), equals(new Date("1999-12-21")))
  },
})

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
