# taste

An elegant set of JavaScript tools for writing well-tested
web applications.

## What does it do?

- Tests run in the browser. You can easily integrate the
  test results into the dev UI of your app.
- Test code can live right next to the production code it's
  testing—in the same file, even. The tests are
  automatically stripped out of production builds of your
  app.
- The tests run extremely fast—up to 50x faster than Jest.
- Add `snowpack` for auto-refresh, and you get
  near-instantaneous test feedback whenever you change a
  JavaScript file.
- To run tests in CI, you can use `puppeteer`.

## Caveats

- Only synchronous tests are supported: no
  `Promise`s, async tests, or timers. This isn't as bad as
  it sounds. Refactor your code so the interesting,
  test-worthy stuff is synchronous, and you'll be happier.

## Setup

I recommend bundling your code for production with
`@snowpack/plugin-webpack`. This will automatically remove
any `taste` tests from your production build.

Do not put any javascript directly in your `index.html`;
as of this writing, the webpack plugin will not build it
correctly and it will not be run in the bundled version of
your site. Instead, do something like this:

```html
<script type="module" src="./index.js"></script>
```

## Development

Fast test runner:

```
yarn snowpack dev
open http://localhost:8080
```

Robot-friendly test runner:

```
yarn test
```
