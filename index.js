export {runTests, debug} from "./src/test-runner.impl.js"
export {expect, createSuite} from "./src/testing.impl.js"
export {is, not, equals, which} from "./src/predicates.impl.js"
export {curry} from "./src/curry.impl.js"
export {formatTestResultsAsText, reportsFailure} from "./src/plain-text-test-formatter.impl.js"

import {createSuite} from "./src/testing.impl.js"

const suite = createSuite()

export const {getAllTests} = suite

export function test(...args) {
  if (process.env.NODE_ENV !== "production")
    suite.test(...args)
}
