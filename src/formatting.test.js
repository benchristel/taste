import {
  indent, pretty, toLines, trimMargin, quote, repeat,
} from "./formatting.js"

import {test, expect} from "./testing.js"
import {equals, is} from "./predicates.js"
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
  "formats numbers"() {
    expect(pretty(1), is, "1")
    expect(pretty(2.5), is, "2.5")
    expect(pretty(-4), is, "-4")
    expect(pretty(1e21), is, "1e+21")
  },

  "represents NaN as 'NaN'"() {
    expect(pretty(NaN), is, "NaN")
  },

  "represents bigints"() {
    expect(pretty(BigInt("100")), is, "100n")
  },

  "represents null as 'null'"() {
    expect(pretty(null), is, "null")
  },

  "represents undefined as 'undefined'"() {
    expect(pretty(undefined), is, "undefined")
  },

  "represents booleans as 'true' and 'false'"() {
    expect(pretty(true), is, "true")
    expect(pretty(false), is, "false")
  },

  "represents symbols as 'Symbol()'"() {
    expect(pretty(Symbol()), is, "Symbol()")
  },

  "represents errors"() {
    expect(pretty(new Error("uh oh")), is, 'Error("uh oh")')
  },

  "represents the class of an error"() {
    expect(pretty(new SyntaxError("uh oh")), is, 'SyntaxError("uh oh")')
  },

  "represents the class of an error with its own constructor property"() {
    const e = new SyntaxError("uh oh")
    e.constructor = 1
    expect(pretty(e), is, 'SyntaxError("uh oh")')
  },

  "formats dates"() {
    expect(
      pretty(new Date("2012-12-21T23:59:59Z")),
      is, "Date(2012-12-21 23:59:59.000 UTC)")
  },

  "represents the empty string as a pair of quotes"() {
    expect(pretty(""), is, '""')
  },

  "quotes a string"() {
    expect(pretty("hi"), is, '"hi"')
  },

  "escapes newlines"() {
    expect(pretty("\n\n"), is, '"\\n\\n"')
  },

  "escapes quotes"() {
    expect(pretty('""'), is, '"\\"\\""')
  },

  "puts slashes around regexen"() {
    expect(pretty(/[a-z]+/), is, '/[a-z]+/')
  },

  "escapes literal slashes in regexen"() {
    expect(pretty(/http:\/\//), is, '/http:\\/\\//')
  },

  "represents an empty array as []"() {
    expect(pretty([]), is, "[]")
  },

  "formats an array with one element inline"() {
    expect(pretty(["a"]), is, '["a"]')
  },

  "formats an array with two elements"() {
    expect(pretty(["a", "b"]), is, trimMargin`
      [
        "a",
        "b"
      ]
    `)
  },

  "formats an empty object"() {
    expect(pretty({}), is, "{}")
  },

  "formats an object with one property inline"() {
    expect(pretty({foo: "a"}), is, '{foo: "a"}')
  },

  "formats an object with two properties"() {
    expect(pretty({foo: "a", bar: "b"}), is, trimMargin`
      {
        foo: "a",
        bar: "b"
      }
    `)
  },

  "quotes object keys that are not valid identifiers"() {
    expect(pretty({"hello, world": 1}), is, '{"hello, world": 1}')
  },

  "quotes an empty object key"() {
    expect(pretty({"": 1}), is, '{"": 1}')
  },

  "doesn't quote a key that is weird but still identifiery"() {
    expect(pretty({$5_word: "casuistry"}), is, '{$5_word: "casuistry"}')
  },

  "doesn't quote a numeric key"() {
    expect(pretty({0: 1}), is, '{0: 1}')
  },

  "formats an object with a constructor"() {
    class SomeClass {
      foo = 1
    }
    expect(pretty(new SomeClass()), is, "SomeClass {foo: 1}")
  },

  "formats a POJO with a constructor property"() {
    expect(pretty({constructor: 1}), is, "{constructor: 1}")
  },

  "formats an object with no prototype"() {
    expect(pretty(Object.create(null)), is, "{}")
  },

  "formats a class instance with an own constructor property"() {
    class SomeClass {}
    const obj = new SomeClass()
    obj.constructor = 1
    expect(pretty(obj), is, "SomeClass {constructor: 1}")
  },

  "omits prototype methods"() {
    class SomeClass {
      aMethod() {}
    }
    expect(pretty(new SomeClass()), is, "SomeClass {}")
  },

  "formats nested objects and arrays"() {
    const obj = {
      foo: [{kludge: 3, qux: 4}, 2],
      bar: {baz: 1}
    }
    expect(pretty(obj), is, trimMargin`
      {
        foo: [
          {
            kludge: 3,
            qux: 4
          },
          2
        ],
        bar: {baz: 1}
      }
    `)
  },

  "formats a set with no members"() {
    const set = new Set()
    expect(pretty(set), is, "Set {}")
  },

  "formats a set with one member"() {
    const set = new Set([1])
    expect(pretty(set), is, "Set {1}")
  },

  "formats a set with two members"() {
    const set = new Set([1, 2])
    expect(pretty(set), is, trimMargin`
      Set {
        1,
        2
      }
    `)
  },

  "avoids infinite recursion in arrays"() {
    const a = []
    const b = [a]
    a.push(b)
    expect(pretty(a), is, "[[<circular reference>]]")
  },

  "avoids infinite recursion in function args"() {
    const a = []
    const f = curry(function f(a, b) {})
    a.push(f(a))
    expect(pretty(a), is, "[f(<circular reference>)]")
  },

  "avoids infinite recursion in POJOs"() {
    const obj = {}
    obj.foo = obj
    expect(pretty(obj), is, "{foo: <circular reference>}")
  },

  "avoids infinite recursion in instances of classes"() {
    class MyClass {}
    const obj = new MyClass()
    obj.foo = obj
    expect(pretty(obj), is, "MyClass {foo: MyClass <circular reference>}")
  },

  "avoids infinite recursion in sets"() {
    const set = new Set()
    set.add(set)
    expect(pretty(set), is, "Set {<circular reference>}")
  },

  "formats a template string"() {
    expect(pretty(`${1}`), is, '"1"')
  },

  "represents an anonymous function as <function>"() {
    expect(pretty(() => {}), is, "<function>")
  },

  "formats a function name"() {
    expect(pretty(pretty), is, "pretty")
  },

  "prints the name of a curried function"() {
    expect(pretty(is), is, "is")
  },

  "prints partial arguments passed to a function"() {
    const foo = curry(function foo(a, b, c) {})
    expect(pretty(foo(1)), is, "foo(1)")
    expect(pretty(foo(1)(2)), is, trimMargin`
      foo(
        1,
        2
      )
    `)
    expect(pretty(foo(0, 1)), is, trimMargin`
      foo(
        0,
        1
      )
    `)
  },

  "prints partial arguments passed to Taste's `equals`"() {
    expect(pretty(equals(1)), is, "equals(1)")
  },

  "pretty-formats function arguments"() {
    const foo = curry(function foo(a, b, c) {})
    expect(pretty(foo("hi")), is, 'foo("hi")')
  },
})

test("toLines", {
  "returns empty string given no args"() {
    expect(toLines(), is, "")
  },

  "returns a single line"() {
    expect(toLines("foo"), is, "foo\n")
  },

  "returns multiple lines"() {
    expect(toLines("foo", "bar"), is, "foo\nbar\n")
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

  "does not indent an empty string"() {
    expect(indent(2, ""), is, "")
  },

  "does not indent a blank line"() {
    expect(indent(2, "foo\n"), is, "  foo\n")
  }
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

test("quote", {
  "stringifies its argument"() {
    expect(quote(1), is, '"1"')
  },

  "escapes quotes"() {
    expect(quote('""'), is, '"\\"\\""')
  },

  "escapes newlines"() {
    expect(quote('\n\n'), is, '"\\n\\n"')
  },

  "escapes backslashes"() {
    expect(quote('\\a\\'), is, '"\\\\a\\\\"')
  },

  "escapes tabs"() {
    expect(quote("\t\t"), is, '"\\t\\t"')
  },

  "escapes nonprinting ASCII"() {
    expect(
      quote("\x00\x07\x1f\x7f"),
      is, '"\\x00\\x07\\x1f\\x7f"')
  },
})
