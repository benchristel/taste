export {runTests, debug} from "./src/test-runner.js"
export {expect, createSuite} from "./src/testing.js"
export {is, not, equals, which} from "./src/predicates.js"
export {curry} from "./src/curry.js"
export {trimMargin} from "./src/formatting.js"
export {formatTestResultsAsText, reportsFailure} from "./src/plain-text-test-formatter.js"

import {createSuite} from "./src/testing.js"

const suite = createSuite()

export const {getAllTests} = suite

export function test(...args) {
  if (process.env.NODE_ENV !== "production")
    suite.test(...args)
}
