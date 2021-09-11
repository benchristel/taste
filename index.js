export {runTests, reportsFailure} from "./src/test-runner.js"
export {expect, createSuite} from "./src/testing.js"
export {is, not} from "./src/predicates.js"
export {curry} from "./src/curry.js"

import {createSuite} from "./src/testing.js"

const suite = createSuite()

export const {getAllTests} = suite

export function test(...args) {
  // The "pure" annotation tells bundlers like webpack
  // to remove a function call if the return value is
  // unused. The effect of doing that here is that none of
  // the tests get included in the bundled code.
  /* @__PURE__ */ suite.test(...args)
}
