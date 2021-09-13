export {runTests, reportsFailure} from "./src/test-runner.js"
export {expect, createSuite} from "./src/testing.js"
export {is, not} from "./src/predicates.js"
export {curry} from "./src/curry.js"

import {createSuite} from "./src/testing.js"

const suite = createSuite()

export const {getAllTests} = suite

export function test(...args) {
  if (typeof process === "undefined" || process.env.NODE_ENV !== "production")
    suite.test(...args)
}
