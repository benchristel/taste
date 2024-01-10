import {curry, functionName} from "./curry.js"

import {test, expect} from "./testing.js"

function is(a, b) {
  return a === b
}

test("curry", {
  "transfers the function name to the curried version"() {
    const curried = curry(function theName() {})
    expect(functionName(curried), is, "theName")
  },

  "adds the passed-in name to the curried function"() {
    const curried = curry(function() {}, "foo")
    expect(functionName(curried), is, "foo")
  },

  "lets you call the curried function normally"() {
    const add = curry((a, b) => a + b)
    expect(add(1, 2), is, 3)
  },

  "lets you pass args one by one"() {
    const add = curry((a, b) => a + b)
    expect(add(1)(2), is, 3)
  },

  "lets you group args"() {
    const add3 = curry((a, b, c) => a + b + c)
    expect(add3(1)(2, 3), is, 6)
    expect(add3(1, 2)(4), is, 7)
  },

  "treats a call with no args as a no-op"() {
    const add3 = curry((a, b, c) => a + b + c)
    expect(add3()(1)()(2, 3), is, 6)
  },

  "is idempotent"() {
    let add = curry(function add(a, b) { return a + b })
    add = curry(add)
    expect(add(1)(2), is, 3)
    expect(add(3, 4), is, 7)
    expect(functionName(add), is, "add")
  }
})
