import {indent, pretty, toLines, repeat} from "./formatting.impl.js"
export {indent, pretty, toLines} from "./formatting.impl.js"

import {test, expect} from "./testing.js"
import {is} from "./predicates.js"
import {curry} from "./curry.js"

test("repeat", {
  "repeats a string zero times"() {
    expect(repeat(0, "ha"), is, "")
  },

  "repeats a string once"() {
    expect(repeat(1, "eh"), is, "eh")
  },

  "repeats a string several times"() {
    expect(repeat(4, "na"), is, "nananana")
  },

  "repeats the empty string"() {
    expect(repeat(10, ""), is, "")
  },
})

test("pretty", {
  "quotes a string"() {
    expect(pretty("hi"), is, '"hi"')
  },

  "prints a function name"() {
    expect(pretty(pretty), is, "pretty")
  },

  "prints the name of a curried function"() {
    expect(pretty(is), is, "is")
  },

  "prints partial arguments passed to a function"() {
    const foo = curry(function foo(a, b, c) {})
    expect(pretty(foo(1)), is, "foo(1)")
    expect(pretty(foo(1)(2)), is, "foo(1, 2)")
    expect(pretty(foo(0, 1)), is, "foo(0, 1)")
  },
})

test("toLines", {
  "returns empty string given no args"() {
    expect(toLines(), is, "")
  },

  "returns a single line"() {
    expect(toLines("foo"), is, "foo")
  },

  "returns multiple lines"() {
    expect(toLines("foo", "bar"), is, "foo\nbar")
  },
})

test("indent", {
  "adds the given number of spaces"() {
    expect(indent(1, "a"), is, " a")
    expect(indent(2, "b"), is, "  b")
  },

  "indents each line"() {
    expect(indent(1, "foo\nbar"), is, " foo\n bar")
  },

  "indents an empty string"() {
    expect(indent(2, ""), is, "  ")
  },
})
