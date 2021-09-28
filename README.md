# taste

A **fast**, 1kb, opinionated test library for frontend JS.

```js
import {test, expect, is} from "taste"

function greet(whomst) {
  return `Hello, ${whomst || "you person, you"}!`
}

test("greet", {
  "greets the world"() {
    expect(greet("world"), is, "Hello, world!")
  },

  "defaults to a generic greeting"() {
    expect(greet(null), is, "Hello, you person, you!")
  },
})
```

## Build Status

Taste's own tests are written using Taste. [You can run the tests in your browser here](https://benchristel.github.io/taste).

## Try it online!

https://benchristel.github.io/taste/try/

## What does it do?

- Tests run in the browser. You can easily integrate the
  test results into the dev UI of your app.
- Your tests can live right next to the production code
  they're testing—in the same file, even. The tests are
  automatically stripped out of production builds of your
  app.
- The tests run extremely fast—up to 50x faster than Jest
  tests. Taste can run tens of thousands of tests per second.
- Add [Snowpack](https://www.snowpack.dev/) for
  auto-refresh, and you can get near-instantaneous test
  feedback whenever you change a JavaScript file.
- To run tests in CI or as a pre-push hook, you can set up
  [Puppeteer](https://developers.google.com/web/tools/puppeteer/),
  which runs the tests in a headless Chrome browser. That
  might sound like a lot of overhead, but it's _still
  slightly faster than using Jest_ (1.2s vs. 1.3s startup
  time on my machine).
- Adding your own matchers is simple as can be: any function
  that returns a boolean can be used as a matcher. Test
  failures still get pretty-formatted as you'd expect.
- Taste's minimalistic syntax supports both BDD-style and
  xUnit test naming conventions. You can name your tests
  after behaviors, scenarios, or test subjects, as you
  prefer. The outline of your tests will be readable no
  matter what convention you choose.
- You can easily insert custom matchers into deep-equality
  assertions, to compare subtrees however you choose.
  This makes Taste a good choice for property-based testing, runtime typechecking, or testing non-deterministic code.
  For example:

  ```js
  import {test, expect, equals, curry, which} from "taste"

  const isBetween = curry(function isBetween(min, max, n) {
    return n >= min && n <= max
  })

  test("randomDndCharacter", {
    "generates ability scores"() {
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

## Caveats and Strong Opinions

- Only synchronous tests are supported: no
  `Promise`s, async tests, or timers. This isn't as bad as
  it sounds. Refactor your code so the interesting,
  test-worthy stuff is synchronous, and you'll be happier.
- There are no equivalents of Jest's `beforeEach` etc.,
  nor are there nested `describe` or `context` blocks. You
  can de-duplicate repeated setup by simply extracting
  functions and calling them, as you would for duplicated
  production code. In my experience, this makes for more
  readable tests in the long run.
- Taste has no facilities for mocking. It's clearer, and
  easy enough, to roll your own test doubles if you need to.
- If you minify or uglify your code in development,
  Taste will break, because it relies on the `name` property
  of functions to give good failure messages. There might
  be other problems as well.

## Syntax

Here's an example of a Taste test for a `repeat` function.

```js
import {test, expect, is} from "taste"
import {repeat} from "./repeat.impl.js"

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
```

## Serving Suggestions

You can run all your tests and display the results by doing
something like this:

```js
import {getAllTests, runTests, formatTestResultsAsText} from "taste"

document.getElementById("testResults").innerText
  = formatTestResultsAsText(runTests(getAllTests()))
```

Of course, you're probably using a UI library that
discourages directly setting `innerText` on an element.
Here's how you might render Taste test results in a React
component:

```js
import * as React from "react"
import {getAllTests, runTests, formatTestResultsAsText} from "taste"

export function TestResults() {
  return <code>
    <pre>
      {formatTestResultsAsText(runTests(getAllTests()))}
    </pre>
  </code>
}
```

Of course, there's no reason you have to render your test
results as plain text. `runTests` returns a simple
JavaScript object suitable for rendering in a variety of
forms. Rendering the test output as a stylish tree of React
elements is left as an exercise for the reader.

Depending on how your app is structured, you may want to
render the test results in a separate HTML file from your
main app, or on a separate route/page within your app. It's
up to you!

I recommend bundling your code for production with
`@snowpack/plugin-webpack`. This will automatically remove
any `taste` tests from your production build.

If you use snowpack+webpack, do not put any JavaScript
directly in your `index.html`; as of this writing, the
webpack plugin will not build it correctly and it will not
be run in the bundled version of your site. Instead, do
something like this to include your root `index.js` module:

```html
<script type="module" src="./index.js"></script>
```

## Development

This section contains instructions for working on Taste
itself.

Fast test runner:

```
yarn snowpack dev
open http://localhost:8080
```

Robot-friendly test runner:

```
yarn test
```
