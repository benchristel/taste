# taste

An elegant set of JavaScript tools for writing well-tested
web applications.

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
