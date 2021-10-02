# taste

A **fast**, modular test library for frontend JS.

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

There is also a set of [downloadable koans/tutorials](https://github.com/benchristel/taste-koans) that walk you through
Taste's features from basic to advanced, and serve as a reference for how to integrate Taste into a project.

## Prerequisites

Taste might be a good fit for your project if...

- You use browser-native ECMAScript modules (ESM) in
  development, via e.g. Snowpack or Vite.
- You have an abundance of gumption and are willing to get
  your hands a bit dirty. Taste is beta code, designed for
  people who like tools they can thoroughly understand.

## Installation

```
yarn add @benchristel/taste
```

Some assembly required; batteries not included. See below
for setup instructions, or refer to an
[example project](https://github.com/benchristel/taste-koans).

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
  This makes Taste a good choice for property-based testing,
  runtime typechecking, or testing non-deterministic code.
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

- Tests can use `async/await`: e.g.

  ```js
  import {test, expect, is} from "taste"

  async function promiseOf(value) {
    return Promise.resolve(value)
  }

  test("promiseOf", {
    async "resolves to the value"() {
      expect(await promiseOf(123), is, 123)
    },
  })
  ```

## What doesn't it do?

- `async` tests are not run in parallel. Thus, if you
  `await` a 100ms timeout in a test, your suite will take
  100ms longer to run. It's up to you to design your code so
  promises can resolve quickly in tests. The ideal is to
  resolve all promises in [microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth),
  which will allow your async tests to run as fast as
  synchronous code.
- There is currently no timeout for `async` tests. If you
  accidentally `await` a promise that never resolves, your
  tests will hang with no indication of what's wrong. Reduce
  the pain of this eventuality by running your tests on
  every code change so you can quickly revert mistakes.
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

## Serving Suggestions

Taste provides basic facilities for writing and running
tests, but is unopinionated about how tests are imported and
their results displayed. This section contains advice on
integrating Taste into your project.

### Importing tests

Taste differs from other test frameworks in that there is
no automatic "test discovery". While Jest lets you specify
a filename pattern like `*.test.js` to load for testing,
Taste uses plain old `import` to load test files into the
browser. If your test files are not imported, the tests
won't run!

There are several patterns you can follow to ensure test
files get loaded:

- Put your tests in the same file as the code they're
  testing! TDDers are fond of saying that tests serve as
  runnable documentation. So just put your tests next to
  your production code, and then you can delete all those
  pesky doc comments.
- Put your tests in separate files, and import them directly
  from your main JavaScript file (`index.js` or `App.js` or
  whatever). The downside of this approach is that you have
  to remember to update `index.js` whenever you add a test
  file. You might also get merge conflicts if many devs add
  test imports to `index.js` concurrently.
- Do what Taste's own codebase does: put the tests and
  documentation for module `foo` in `foo.js`, and the
  production code in `foo.impl.js`, which `foo.js` imports
  and re-exports. This may seem strange at first, but it has
  a few distinct advantages:
  - It cleanly separates interface from implementation:
    `foo.js` contains the tests, documentation, and list of
    exports for the module `foo`; someone who wants to use
    `foo` can just read that file and not have to scroll
    through the implementation.
  - `foo.impl.js` can export code that `foo.js` doesn't
    re-export; this allows `foo.js` to directly test that
    code while clearly communicating that it isn't used
    outside the `foo` module.
  - If you maintain the convention that other modules must
    import `foo.js` and not `foo.impl.js`, you never have to
    worry that your tests won't be loaded.

### Displaying test output

You can run all your tests and display the results by doing
something like this:

```js
// index.js
import "./App.js"
import {getAllTests, runTests, formatTestResultsAsText} from "taste"

// getAllTests() must be called *after* all test files have
// been imported, which is supposed to happen via the
// `import "./App.js"` above
document.getElementById("testResults").innerText
  = formatTestResultsAsText(await runTests(getAllTests()))
```

Of course, you're probably using a UI library that
discourages directly setting `innerText` on an element.
Here's how you might render Taste test results in a React
component:

```js
// index.js
import "./App.js"

// getAllTests() must be called *after* all test files have
// been imported, which is supposed to happen via the
// `import "./App.js"` above
window.testResults = await runTests(getAllTests())
```

```js
// TestResults.jsx
import * as React from "react"
import {getAllTests, runTests, formatTestResultsAsText} from "taste"

export function TestResults() {
  return <code>
    <pre>
      {formatTestResultsAsText(window.testResults)}
    </pre>
  </code>
}
```

Taste's built-in formatter renders test results as plain
text, but you needn't be limited to this. `await runTests`
returns a simple JavaScript object suitable for rendering
in a variety of forms. Rendering the test output as a
stylish tree of React elements is left as an exercise for
the reader.

Depending on how your app is structured, you may want to
render the test results in a separate HTML file from your
main app, or on a separate route/page within your app. It's
up to you!

### Removing tests from production builds

If you're using Webpack, Rollup, or most other module
bundlers, you shouldn't have to do anything special to
remove Taste tests from the production build of your app.
If you find that tests are showing up in bundled code,
ensure that `process.env.NODE_ENV === "production"` and your
optimizer is configured for tree-shaking / dead code
elimination.

### Snowpack

Taste works with [Snowpack](https://www.snowpack.dev/) with
no special configuration.

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

### Vite + React

Taste works great with Vite! I recommend it. You will need
to make a couple tweaks to get it to work well, though.

First, set your build target to something that supports
bigints, e.g. `chrome91`.

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "chrome91",
  },
})
```

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
