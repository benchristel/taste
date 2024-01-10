#!/bin/sh
yarn esbuild esbuild-root.js \
  --bundle --minify \
  --outfile=dist/taste.min.js \
  --define:process.env.NODE_ENV='"development"' \
  --target=es6