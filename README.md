# @benchristel/taste

A **fast** JavaScript test framework, for browser apps, NPM packages, and Node.js
scripts.

```js
import {test, expect, is} from "@benchristel/taste"

test("greet", {
  "greets the world"() {
    expect(greet("world"), is, "Hello, world!")
  },

  "defaults to a generic greeting"() {
    expect(greet(null), is, "Hello, you person, you!")
  },
})

function greet(name) {
  return `Hello, ${name || "you person, you"}!`
}
```

## Build Status

Taste's own tests are written using Taste. [You can run the tests in your browser here](https://benchristel.github.io/taste).

## Try it!

https://benchristel.github.io/try-taste/

There is also a set of [downloadable koans/tutorials](https://github.com/benchristel/taste-koans) that walk you through
Taste's features from basic to advanced, and serve as a reference for how to integrate Taste into a project.

## Node.js Quick Start

```js
// copy-paste this into test.mjs
import {test, expect, is} from "@benchristel/taste"
import {getAllTests, runTests, formatTestResultsAsText} from "@benchristel/taste"

// add a test to the global suite
test("my first Taste test", {
  "runs"() {
    expect(1 + 1, is, 2)
  },
})

// run the tests and print the results
runTests(getAllTests())
  .then(formatTestResultsAsText)
  .then(console.log)
```

Then run `time node test.mjs`. Replace `node` with `bun` to go even faster! You can also use `bun --hot test.mjs` to run your tests on every code change.

## Project Templates

- [Preact + TypeScript + Vite + Taste](https://github.com/benchristel/preact-typescript-vite-taste) (recommended)
- [React + Flow + Snowpack + Taste](https://github.com/benchristel/react-flow-snowpack-taste) (deprecated)

## Installation

```
yarn add @benchristel/taste
```

## Features

- **Tests can run in the browser.** You can integrate test
  results into the dev UI of your app!
- **Tests can live in the same files as production code.**
  Or you can use any other organization scheme. The tests
  are automatically stripped out of production builds of
  your app.
- **The tests are fast**—up to 50x faster than Jest tests.
  Taste can run tens of thousands of tests per second.
- **Custom matchers couldn't be simpler.** Any function
  that returns a boolean can be used in a test assertion.
  Test failures still get pretty-formatted as you'd expect.

## Non-features

- `async` tests are not run in parallel. Thus, if you
  `await` a 100ms timer in a test, your suite will take
  100ms longer to run. It's up to you to design your code so
  promises can resolve quickly in tests. The ideal is to
  resolve all promises in [microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth),
  which will allow your async tests to run as fast as
  synchronous code.
- By default, there is no timeout for `async` tests. If you
  accidentally `await` a promise that never resolves, your
  tests will hang with no indication of what's wrong. Reduce
  the pain of this eventuality by running your tests on
  every code change so you can quickly revert mistakes. You
  can add timeouts to your test suite with
  [@benchristel/taste-timeout](https://www.npmjs.com/package/@benchristel/taste-timeout).
- There are no equivalents of Jest's `beforeEach` etc.,
  nor are there nested `describe` or `context` blocks. You
  can de-duplicate repeated setup by simply extracting
  functions and calling them, as you would for duplicated
  production code. In my experience, this makes for more
  readable tests in the long run. However, Taste is
  flexible enough that you could build your own Jest-like
  test-definition syntax on top of it, if you wanted to.
- Taste has no facilities for mocking. It's clearer, and
  easy enough, to roll your own test doubles if you need to.
  Or use another mocking library; [there are plenty to
  choose from](https://www.npmjs.com/search?q=mock).

## Recommended Integrations

- Add [Vite](https://vitejs.dev/) for
  auto-refresh, and you can get near-instantaneous test
  feedback whenever you change a JavaScript file.
- To run browser tests in CI or as a pre-push hook, you can set up
  [Puppeteer](https://developers.google.com/web/tools/puppeteer/),
  which runs the tests in a headless Chrome browser. That
  might sound like a lot of overhead, but it's _still
  slightly faster than using Jest_ (1.2s vs. 1.3s startup
  time on my machine).

## API Documentation

### Writing Tests

```
import {
  test,
  expect,
  is,
  equals,
  not,
  which,
} from "@benchristel/taste"
```

#### `test(subject: string, TestDefinitions): void`

The `test` method is the usual way of writing tests in
Taste. The `TestDefinitions` type is a map of strings
(test scenario names) to test functions:

```ts
type TestDefinitions = {
  [scenario: string]: () => void | Promise<void>,
}
```

Typical usage looks like this:

```js
import {test, expect, is} from "@benchristel/taste"

test("a Counter", {
  "starts at zero"() {
    const c = new Counter()
    expect(c.value(), is, 0)
  },

  "increments once"() {
    const c = new Counter()
    c.increment()
    expect(c.value(), is, 1)
  },
})
```

When the test results are formatted using Taste's built-in
formatter (`formatTestResultsAsText`), the subject name
and scenario name will be concatenated for each test. So
in the above example, you'd see failure messages like:

```
a Counter increments once
  expect(
    0,
    is,
    1
  )
```

#### `expect(actual, predicate: () => boolean, ...expected): void`

Throws an error if the given `predicate` returns a falsey
value when passed the `expected` and `actual` values.

Note that the `subject` is passed as the _last_ argument
to the predicate function. This is to accommodate predicates
that are designed to be curried.

Here's an example of how you might define a custom
`isGreaterThan` predicate:

```js
import {test, expect, is} from "@benchristel/taste"

function isGreaterThan(reference, n) {
  return n > reference
}

test("rolling a die", {
  "produces a positive number"() {
    expect(rollDie(), isGreaterThan, 0)
  },
})
```

#### `is(expected, actual): boolean`

Returns whether its arguments are `===`.

`is` is curried, so the following are equivalent:

```js
expect(1 + 1, is, 2)
expect(1 + 1, is(2))
```

#### `equals(expected, actual): boolean`

Returns whether two objects are deeply equal. The rules
for comparison are complicated, but work similarly to the
ones in Jest, Jasmine, and other test frameworks you might
be familiar with. For examples of behavior, see
[the tests](https://github.com/benchristel/taste/blob/main/src/predicates.js).

```js
equals({a: 1}, {a: 1}) // true
equals({a: 1}, {a: 2}) // false
```

`equals` is curried, so the following are equivalent:

```js
expect(1 + 1, equals, 2)
expect(1 + 1, equals(2))
```

#### `not(p: () => boolean): () => boolean`

Returns a negated version of the given predicate `p`; i.e.
`not(p)` returns true for some arguments iff `p` returns
falsey for those arguments.

The following are equivalent:

```
expect(2 + 2, not(is), 5)
expect(2 + 2, not(is(5)))
```

#### `curry(func, name)`

Returns a curried version of the given function.
Partially-applied functions generated from the curried
function will be pretty-printed by
`formatTestResultsAsText` in a format that includes the
given `name`.

#### `which(predicate): magic`

Given a predicate, returns a magical object that `equals`
any value for which the predicate returns truthy. You can
use `which` to customize how objects should be compared when
using `equals`—usually to relax some constraint.

```js
const isBetween = curry((min, max, n) => {
  return n >= min && n <= max
}, "isBetween")

test("randomDndCharacter", {
  "generates reasonable ability scores"() {
    expect(randomDndCharacter(), equals, {
      str: which(isBetween(7, 18)),
      dex: which(isBetween(7, 18)),
      con: which(isBetween(7, 18)),
      int: which(isBetween(7, 18)),
      wis: which(isBetween(7, 18)),
      cha: which(isBetween(7, 18)),
    })
  },
})
```

### Running Tests

```
import {
  getAllTests,
  runTests,
  formatTestResultsAsText,
} from "@benchristel/taste"
```

#### `getAllTests(): Array<Test>`

Returns all tests that have been registered via `test()`.
Nilpotent, but may return different results on subsequent
calls if there are intervening calls to `test()`.

#### `runTests(Array<Test>): Promise<SuiteResults>`

Runs tests asynchronously and returns their results as a
machine-readable object.

#### `formatTestResultsAsText(SuiteResults): string`

Formats test results from `runTests` as a human-readable
string.

## Integrating with build tools

### Snowpack

Taste works with [Snowpack](https://www.snowpack.dev/) with
no special configuration.

I recommend bundling your code for production with
`@snowpack/plugin-webpack`. This will automatically remove
any `taste` tests from your production build.

Non-Taste-specific note: if you use snowpack+webpack, do not
put any JavaScript
directly in your `index.html`; as of this writing, the
webpack plugin will not build it correctly and it will not
be run in the bundled version of your site. Instead, do
something like this to include your root `index.js` module:

```html
<script type="module" src="./index.js"></script>
```

### Vite + React

Taste works great with Vite! I recommend it.

To ensure your tests run automatically and you do not see
duplicate test results when components get hot-reloaded, I
recommend turning hot module replacement (HMR) **off** for
files that contain tests. You can do that like this:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({include: ["**/*.impl.js", "**/*.impl.jsx"]})],
  build: {
    target: "chrome91",
  },
})
```

Using this config, you'd place all of your non-test code
in `*.impl.js` or `*.impl.jsx` files, and only those files
would get hot-reloaded. An alternative would be to use
something like `exclude: ["**/*.test.js"]` if you use that
naming convention.

### Removing tests from production builds

If you're using Webpack, Rollup, or most other module
bundlers, you shouldn't have to do anything special to
remove Taste tests from the production build of your app.
If you find that tests are showing up in bundled code,
ensure that `process.env.NODE_ENV === "production"` and your
optimizer is configured for tree-shaking / dead code
elimination.

## Development

This section contains instructions for working on Taste
itself.

Fast test runner:

```
yarn dev
open http://localhost:8080
```

Robot-friendly test runner:

```
yarn test
```
