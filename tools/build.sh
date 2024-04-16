#!/bin/sh
yarn esbuild esbuild-root.js \
  --bundle --minify \
  --outfile=dist/taste.min.js \
  --define:process.env.NODE_ENV='"development"' \
  --target=es6
# NODE_ENV=development prevents tests from being stripped out,
# as they normally are in production builds. We want to keep the tests
# since the thing we are building is Taste's test suite.
NODE_ENV=development yarn vite build