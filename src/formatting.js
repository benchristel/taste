import {indent, pretty, toLines, trimMargin, repeat} from "./formatting.impl.js"
export {indent, pretty, toLines, trimMargin} from "./formatting.impl.js"

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

test("trimMargin", {
  "given an empty string"() {
    expect(trimMargin``, is, "")
  },

  "given a string with one line break and space"() {
    expect(trimMargin`
    `, is, "")
  },

  "given a string with no margin"() {
    expect(trimMargin`hi`, is, "hi")
  },

  "removes an initial newline"() {
    const trimmed = trimMargin`
hi`
    expect(trimmed, is, "hi")
  },

  "removes a final newline followed by spaces"() {
    const trimmed = trimMargin`hi
    `
    expect(trimmed, is, "hi")
  },

  "removes an initial windows line ending"() {
    const trimmed = trimMargin("\r\nfoo")
    expect(trimmed, is, "foo")
  },

  "removes spaces from the beginning of a one-line string"() {
    const trimmed = trimMargin("     foo")
    expect(trimmed, is, "foo")
  },

  "removes mixed tabs and spaces"() {
    const trimmed = trimMargin("\t foo\n\t bar")
    expect(trimmed, is, "foo\nbar")
  },

  "does not remove mismatched tabs and spaces"() {
    const trimmed = trimMargin("\t foo\n \tbar")
    expect(trimmed, is, "foo\n \tbar")
  },

  "converts windows line endings to unix ones"() {
    const trimmed = trimMargin("foo\r\nbar")
    expect(trimmed, is, "foo\nbar")
  },

  "removes the same number of spaces from all lines"() {
    const trimmed = trimMargin`
      foo
        bar
          baz
    `
    expect(trimmed, is, "foo\n  bar\n    baz")
  },
})
