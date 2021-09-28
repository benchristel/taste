import {runTests, createSuite, formatTestResultsAsText, expect, is} from "../index.js"

const textarea = document.getElementById('editor')
const editor = window.CodeMirror.fromTextArea(textarea, {mode: 'javascript'})
const output = document.getElementById("output")

function getTestResults(code) {
  const suite = createSuite()
  window.test = suite.test
  window.expect = expect
  window.is = is
  eval("(function() {" + code + "})()")
  return runTests(suite.getAllTests())
}

function runTestsAndDisplayOutput() {
  try {
    const results = getTestResults(editor.getValue())
    output.innerText = formatTestResultsAsText(results)
    console.log("results")
  } catch (e) {
    output.innerText = e.message
    console.log("error", e, output)
  }
}


let debounceTimeout = null
window.addEventListener('keyup', function() {
  window.clearTimeout(debounceTimeout)
  debounceTimeout = window.setTimeout(runTestsAndDisplayOutput, 300)
})

runTestsAndDisplayOutput()
