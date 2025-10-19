var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});__name(function(){const relList=document.createElement("link").relList;if(relList&&relList.supports&&relList.supports("modulepreload"))return;for(const link of document.querySelectorAll('link[rel="modulepreload"]'))processPreload(link);new MutationObserver(mutations=>{for(const mutation of mutations)if(mutation.type==="childList")for(const node of mutation.addedNodes)node.tagName==="LINK"&&node.rel==="modulepreload"&&processPreload(node)}).observe(document,{childList:!0,subtree:!0});function getFetchOpts(link){const fetchOpts={};return link.integrity&&(fetchOpts.integrity=link.integrity),link.referrerPolicy&&(fetchOpts.referrerPolicy=link.referrerPolicy),link.crossOrigin==="use-credentials"?fetchOpts.credentials="include":link.crossOrigin==="anonymous"?fetchOpts.credentials="omit":fetchOpts.credentials="same-origin",fetchOpts}__name(getFetchOpts,"getFetchOpts");function processPreload(link){if(link.ep)return;link.ep=!0;const fetchOpts=getFetchOpts(link);fetch(link.href,fetchOpts)}__name(processPreload,"processPreload")},"polyfill")();const $getBoundArguments=Symbol(),$unapplied=Symbol();function curry$1(f){switch(f.length){case 2:return curry2(f);case 3:return curry3(f);default:return curryVarargs(f)}}__name(curry$1,"curry$1");function curry2(f){function curried(a,b){switch(arguments.length){case 1:return copyMetadata(curried,[a],f.bind(null,a));default:return f(a,b)}}return __name(curried,"curried"),initMetadata(f,curried)}__name(curry2,"curry2");function curry3(f){function curried(a,b,c){switch(arguments.length){case 1:return copyMetadata(curried,[a],curry2(f.bind(null,a)));case 2:return copyMetadata(curried,[a,b],f.bind(null,a,b));default:return f(a,b,c)}}return __name(curried,"curried"),initMetadata(f,curried)}__name(curry3,"curry3");function curryVarargs(f){function curried(...args){return args.length<f.length?copyMetadata(curried,args,curried.bind(null,...args)):f(...args)}return __name(curried,"curried"),initMetadata(f,curried)}__name(curryVarargs,"curryVarargs");function initMetadata(original,curried){return curried.displayName=getName(original),curried[$getBoundArguments]=()=>[],curried[$unapplied]=curried,curried}__name(initMetadata,"initMetadata");function copyMetadata(source,args,destination){return destination.displayName=getName(source),destination[$getBoundArguments]=()=>getArgs(source).concat(args),destination[$unapplied]=source[$unapplied],destination}__name(copyMetadata,"copyMetadata");function getName(f){return f.displayName??f.name}__name(getName,"getName");function getArgs(f){return f[$getBoundArguments]()??[]}__name(getArgs,"getArgs");function curry(f,name){const curried=curry$1(f);return curried.displayName=name||functionName(f),curried}__name(curry,"curry");function originalFunction(f){return f[$unapplied]}__name(originalFunction,"originalFunction");function partialArgs(f){return f[$getBoundArguments]?.()??[]}__name(partialArgs,"partialArgs");function functionName(f){return f.displayName||f.name}__name(functionName,"functionName");function lastOf(a){return a[a.length-1]}__name(lastOf,"lastOf");function firstOf(a){return a[0]}__name(firstOf,"firstOf");const which=curry(function(predicate,x){return predicate(x)},"which"),equals=curry(function(a,b){if(isCustomMatcher(a))return a(b);if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((_,i)=>equals(a[i],b[i]));if(a instanceof Function&&b instanceof Function)return originalFunction(a)&&originalFunction(a)===originalFunction(b)?equals(partialArgs(a),partialArgs(b)):a===b;if(a instanceof Date&&b instanceof Date)return a.toISOString()===b.toISOString();if(a instanceof Set&&b instanceof Set)return a.size===b.size&&[...a.values()].every(v=>b.has(v));if(a instanceof Error&&b instanceof Error)return a.message===b.message&&a.__proto__.constructor===b.__proto__.constructor;if(isObject(a)&&isObject(b)){const aKeys=Object.keys(a),bKeys=Object.keys(b);return aKeys.length===bKeys.length&&aKeys.every(k=>equals(a[k],b[k]))&&a.__proto__?.constructor===b.__proto__?.constructor}return a===b},"equals"),is$2=curry(function(a,b){return a===b},"is"),not=curry(function(predicate,subject,...args){return!predicate(subject,...args)},"not"),isBlank=curry(function(s){return/^\s*$/.test(s)},"isBlank");function isObject(x){return!!x&&typeof x=="object"}__name(isObject,"isObject");function isCustomMatcher(f){return f instanceof Function&&originalFunction(f)===which&&partialArgs(f).length===1}__name(isCustomMatcher,"isCustomMatcher");function prettyFunctionName(f){return functionName(f)||"<function>"}__name(prettyFunctionName,"prettyFunctionName");function pretty(x){const stack=[];return _pretty(x);function _pretty(x2){if(x2===null)return"null";if(typeof x2=="function")return preventInfiniteLoop(x2,prettyFunction);if(typeof x2=="string")return quote(x2);if(typeof x2=="bigint")return`${x2}n`;if(Array.isArray(x2))return preventInfiniteLoop(x2,prettyArray);if(x2 instanceof Date)return`Date(${x2.toISOString().replace("T"," ").replace("Z"," UTC")})`;if(x2 instanceof RegExp)return String(x2);if(x2 instanceof Error)return`${prettyConstructor(x2)}(${quote(x2.message)})`;if(x2 instanceof Set)return preventInfiniteLoop(x2,prettySet);if(typeof x2=="object"){const constructor=x2?.__proto__?.constructor;return constructor===Object||!constructor?preventInfiniteLoop(x2,prettyObject):`${prettyConstructor(x2)} ${preventInfiniteLoop(x2,prettyObject)}`}return String(x2)}function preventInfiniteLoop(x2,cb){if(stack.indexOf(x2)>-1)return"<circular reference>";stack.push(x2);const result=cb(x2);return stack.pop(),result}function prettyFunction(f){const args=partialArgs(f).map(_pretty),name=prettyFunctionName(f);return args.length?formatStructure(name+"(",args,",",")"):name}function prettyArray(a){return formatStructure("[",a.map(_pretty),",","]")}function prettyObject(x2){const innards=Object.entries(x2).map(([k,v])=>`${prettyKey(k)}: ${_pretty(v)}`);return formatStructure("{",innards,",","}")}function prettySet(x2){const innards=[...x2.values()].map(_pretty);return formatStructure("Set {",innards,",","}")}}__name(pretty,"pretty");function prettyKey(k){return/^[a-zA-Z0-9_$]+$/.test(k)?k:quote(k)}__name(prettyKey,"prettyKey");function prettyConstructor(obj){return prettyFunctionName(obj.__proto__.constructor)}__name(prettyConstructor,"prettyConstructor");function quote(s){return'"'+String(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/"/g,'\\"').replace(/[\x00-\x1f\x7f]/g,hexEscape)+'"'}__name(quote,"quote");function hexEscape(c){const hex=c.charCodeAt(0).toString(16);return"\\x"+(hex.length<2?"0"+hex:hex)}__name(hexEscape,"hexEscape");function indent(level,s){return s.split(`
`).map(l=>l&&prepend(repeat(level," "))(l)).join(`
`)}__name(indent,"indent");function toLines(...strs){return strs.map(append(`
`)).join("")}__name(toLines,"toLines");function repeat(n,s){return Array(n+1).join(s)}__name(repeat,"repeat");const prepend=__name(prefix=>s=>prefix+s,"prepend"),append=__name(suffix=>s=>s+suffix,"append"),removePrefix=curry(__name(function(prefix,s){return s.slice(0,prefix.length)===prefix?s.slice(prefix.length):s},"removePrefix"));function lines(s){return String(s).split(/\r?\n/)}__name(lines,"lines");function trimMargin(s){const lns=lines(s);isBlank(firstOf(lns))&&lns.shift(),isBlank(lastOf(lns))&&lns.pop();const initialIndent=/^[ \t]*/.exec(firstOf(lns))[0];return lns.map(removePrefix(initialIndent)).join(`
`)}__name(trimMargin,"trimMargin");function formatStructure(prefix,innards,delim,suffix){return innards.length<2?prefix+innards.join("")+suffix:prefix+`
`+indent(2,innards.join(delim+`
`))+`
`+suffix}__name(formatStructure,"formatStructure");const suite=createSuite(),{getAllTests}=suite;function test(...args){suite.test(...args)}__name(test,"test");function createSuite(){const testCases=[];return{test:test2,getAllTests:getAllTests2};function test2(subject,definitions){testCases.push(...Object.entries(definitions).map(([behavior,fn])=>TestCase(subject,behavior,fn)))}function getAllTests2(){return testCases}}__name(createSuite,"createSuite");function expect(subject,expectation,...args){const pass=expectation(...args,subject);if(typeof pass=="function")throw new Error("The matcher function `"+prettyFunctionName(pass)+"` returned a function instead of a boolean. You might need to pass another argument to it.");if(!pass)throw new ExpectationFailure([subject,expectation,...args])}__name(expect,"expect");function TestCase(subject,scenario,fn){return{subject,scenario,fn}}__name(TestCase,"TestCase");class ExpectationFailure extends Error{static{__name(this,"ExpectationFailure")}constructor(expectArgs){super("Expectation failed"),this.expectArgs=expectArgs}}function is$1(a,b){return a===b}__name(is$1,"is$1");test("curry",{"transfers the function name to the curried version"(){const curried=curry(__name(function(){},"theName"));expect(functionName(curried),is$1,"theName")},"adds the passed-in name to the curried function"(){const curried=curry(function(){},"foo");expect(functionName(curried),is$1,"foo")},"lets you call the curried function normally"(){const add=curry((a,b)=>a+b);expect(add(1,2),is$1,3)},"lets you pass args one by one"(){const add=curry((a,b)=>a+b);expect(add(1)(2),is$1,3)},"lets you group args"(){const add3=curry((a,b,c)=>a+b+c);expect(add3(1)(2,3),is$1,6),expect(add3(1,2)(4),is$1,7)},"is idempotent"(){let add=curry(__name(function(a,b){return a+b},"add"));add=curry(add),expect(add(1)(2),is$1,3),expect(add(3,4),is$1,7),expect(functionName(add),is$1,"add")}});test("repeat",{"repeats a string zero times"(){expect(repeat(0,"ha"),is$2,"")},"repeats a string once"(){expect(repeat(1,"eh"),is$2,"eh")},"repeats a string several times"(){expect(repeat(4,"na"),is$2,"nananana")},"repeats the empty string"(){expect(repeat(10,""),is$2,"")}});test("pretty",{"formats numbers"(){expect(pretty(1),is$2,"1"),expect(pretty(2.5),is$2,"2.5"),expect(pretty(-4),is$2,"-4"),expect(pretty(1e21),is$2,"1e+21")},"represents NaN as 'NaN'"(){expect(pretty(NaN),is$2,"NaN")},"represents bigints"(){expect(pretty(BigInt("100")),is$2,"100n")},"represents null as 'null'"(){expect(pretty(null),is$2,"null")},"represents undefined as 'undefined'"(){expect(pretty(void 0),is$2,"undefined")},"represents booleans as 'true' and 'false'"(){expect(pretty(!0),is$2,"true"),expect(pretty(!1),is$2,"false")},"represents symbols as 'Symbol()'"(){expect(pretty(Symbol()),is$2,"Symbol()")},"represents errors"(){expect(pretty(new Error("uh oh")),is$2,'Error("uh oh")')},"represents the class of an error"(){expect(pretty(new SyntaxError("uh oh")),is$2,'SyntaxError("uh oh")')},"represents the class of an error with its own constructor property"(){const e=new SyntaxError("uh oh");e.constructor=1,expect(pretty(e),is$2,'SyntaxError("uh oh")')},"formats dates"(){expect(pretty(new Date("2012-12-21T23:59:59Z")),is$2,"Date(2012-12-21 23:59:59.000 UTC)")},"represents the empty string as a pair of quotes"(){expect(pretty(""),is$2,'""')},"quotes a string"(){expect(pretty("hi"),is$2,'"hi"')},"escapes newlines"(){expect(pretty(`

`),is$2,'"\\n\\n"')},"escapes quotes"(){expect(pretty('""'),is$2,'"\\"\\""')},"puts slashes around regexen"(){expect(pretty(/[a-z]+/),is$2,"/[a-z]+/")},"escapes literal slashes in regexen"(){expect(pretty(/http:\/\//),is$2,"/http:\\/\\//")},"represents an empty array as []"(){expect(pretty([]),is$2,"[]")},"formats an array with one element inline"(){expect(pretty(["a"]),is$2,'["a"]')},"formats an array with two elements"(){expect(pretty(["a","b"]),is$2,trimMargin`
      [
        "a",
        "b"
      ]
    `)},"formats an empty object"(){expect(pretty({}),is$2,"{}")},"formats an object with one property inline"(){expect(pretty({foo:"a"}),is$2,'{foo: "a"}')},"formats an object with two properties"(){expect(pretty({foo:"a",bar:"b"}),is$2,trimMargin`
      {
        foo: "a",
        bar: "b"
      }
    `)},"quotes object keys that are not valid identifiers"(){expect(pretty({"hello, world":1}),is$2,'{"hello, world": 1}')},"quotes an empty object key"(){expect(pretty({"":1}),is$2,'{"": 1}')},"doesn't quote a key that is weird but still identifiery"(){expect(pretty({$5_word:"casuistry"}),is$2,'{$5_word: "casuistry"}')},"doesn't quote a numeric key"(){expect(pretty({0:1}),is$2,"{0: 1}")},"formats an object with a constructor"(){class SomeClass{static{__name(this,"SomeClass")}foo=1}expect(pretty(new SomeClass),is$2,"SomeClass {foo: 1}")},"formats a POJO with a constructor property"(){expect(pretty({constructor:1}),is$2,"{constructor: 1}")},"formats an object with no prototype"(){expect(pretty(Object.create(null)),is$2,"{}")},"formats a class instance with an own constructor property"(){class SomeClass{static{__name(this,"SomeClass")}}const obj=new SomeClass;obj.constructor=1,expect(pretty(obj),is$2,"SomeClass {constructor: 1}")},"omits prototype methods"(){class SomeClass{static{__name(this,"SomeClass")}aMethod(){}}expect(pretty(new SomeClass),is$2,"SomeClass {}")},"formats nested objects and arrays"(){expect(pretty({foo:[{kludge:3,qux:4},2],bar:{baz:1}}),is$2,trimMargin`
      {
        foo: [
          {
            kludge: 3,
            qux: 4
          },
          2
        ],
        bar: {baz: 1}
      }
    `)},"formats a set with no members"(){expect(pretty(new Set),is$2,"Set {}")},"formats a set with one member"(){expect(pretty(new Set([1])),is$2,"Set {1}")},"formats a set with two members"(){expect(pretty(new Set([1,2])),is$2,trimMargin`
      Set {
        1,
        2
      }
    `)},"avoids infinite recursion in arrays"(){const a=[],b=[a];a.push(b),expect(pretty(a),is$2,"[[<circular reference>]]")},"avoids infinite recursion in function args"(){const a=[],f=curry(__name(function(a2,b){},"f"));a.push(f(a)),expect(pretty(a),is$2,"[f(<circular reference>)]")},"avoids infinite recursion in POJOs"(){const obj={};obj.foo=obj,expect(pretty(obj),is$2,"{foo: <circular reference>}")},"avoids infinite recursion in instances of classes"(){class MyClass{static{__name(this,"MyClass")}}const obj=new MyClass;obj.foo=obj,expect(pretty(obj),is$2,"MyClass {foo: MyClass <circular reference>}")},"avoids infinite recursion in sets"(){const set=new Set;set.add(set),expect(pretty(set),is$2,"Set {<circular reference>}")},"formats a template string"(){expect(pretty("1"),is$2,'"1"')},"represents an anonymous function as <function>"(){expect(pretty(()=>{}),is$2,"<function>")},"formats a function name"(){expect(pretty(pretty),is$2,"pretty")},"prints the name of a curried function"(){expect(pretty(is$2),is$2,"is")},"prints partial arguments passed to a function"(){const foo=curry(__name(function(a,b,c){},"foo"));expect(pretty(foo(1)),is$2,"foo(1)"),expect(pretty(foo(1)(2)),is$2,trimMargin`
      foo(
        1,
        2
      )
    `),expect(pretty(foo(0,1)),is$2,trimMargin`
      foo(
        0,
        1
      )
    `)},"pretty-formats function arguments"(){const foo=curry(__name(function(a,b,c){},"foo"));expect(pretty(foo("hi")),is$2,'foo("hi")')}});test("toLines",{"returns empty string given no args"(){expect(toLines(),is$2,"")},"returns a single line"(){expect(toLines("foo"),is$2,`foo
`)},"returns multiple lines"(){expect(toLines("foo","bar"),is$2,`foo
bar
`)}});test("indent",{"adds the given number of spaces"(){expect(indent(1,"a"),is$2," a"),expect(indent(2,"b"),is$2,"  b")},"indents each line"(){expect(indent(1,`foo
bar`),is$2,` foo
 bar`)},"does not indent an empty string"(){expect(indent(2,""),is$2,"")},"does not indent a blank line"(){expect(indent(2,`foo
`),is$2,`  foo
`)}});test("trimMargin",{"given an empty string"(){expect(trimMargin``,is$2,"")},"given a string with one line break and space"(){expect(trimMargin`
    `,is$2,"")},"given a string with no margin"(){expect(trimMargin`hi`,is$2,"hi")},"removes an initial newline"(){const trimmed=trimMargin`
hi`;expect(trimmed,is$2,"hi")},"removes a final newline followed by spaces"(){const trimmed=trimMargin`hi
    `;expect(trimmed,is$2,"hi")},"removes an initial windows line ending"(){const trimmed=trimMargin(`\r
foo`);expect(trimmed,is$2,"foo")},"removes spaces from the beginning of a one-line string"(){const trimmed=trimMargin("     foo");expect(trimmed,is$2,"foo")},"removes mixed tabs and spaces"(){const trimmed=trimMargin(`	 foo
	 bar`);expect(trimmed,is$2,`foo
bar`)},"does not remove mismatched tabs and spaces"(){const trimmed=trimMargin(`	 foo
 	bar`);expect(trimmed,is$2,`foo
 	bar`)},"converts windows line endings to unix ones"(){const trimmed=trimMargin(`foo\r
bar`);expect(trimmed,is$2,`foo
bar`)},"removes the same number of spaces from all lines"(){const trimmed=trimMargin`
      foo
        bar
          baz
    `;expect(trimmed,is$2,`foo
  bar
    baz`)}});test("quote",{"stringifies its argument"(){expect(quote(1),is$2,'"1"')},"escapes quotes"(){expect(quote('""'),is$2,'"\\"\\""')},"escapes newlines"(){expect(quote(`

`),is$2,'"\\n\\n"')},"escapes backslashes"(){expect(quote("\\a\\"),is$2,'"\\\\a\\\\"')},"escapes tabs"(){expect(quote("		"),is$2,'"\\t\\t"')},"escapes nonprinting ASCII"(){expect(quote("\0\x07"),is$2,'"\\x00\\x07\\x1f\\x7f"')}});const blankLine=`

`;function formatTestResultsAsText({results:results2}){let anyErrors=!1,anyInstrumentation=!1,resultsNeedingAttention=[];for(const r of results2){let needsAttention=!1;r.error&&(needsAttention=anyErrors=!0),r.instrumentLog.length&&(needsAttention=anyInstrumentation=!0),needsAttention&&resultsNeedingAttention.push(r)}return anyErrors?suiteFailed(resultsNeedingAttention):anyInstrumentation?suitePassedWithInstrumentation(results2.length,resultsNeedingAttention):suitePassed(results2.length)}__name(formatTestResultsAsText,"formatTestResultsAsText");function reportsFailure(testOutput2){return/fail/i.test(testOutput2)}__name(reportsFailure,"reportsFailure");function suiteFailed(failures){return failures.map(formatFailure).join(blankLine)+blankLine+"Tests failed."}__name(suiteFailed,"suiteFailed");function suitePassed(numPassed){switch(numPassed){case 0:return"No tests to run.";case 1:return"One test ran, and found no issues.";default:return`${numPassed} tests ran, and found no issues.`}}__name(suitePassed,"suitePassed");function suitePassedWithInstrumentation(numPassed,resultsWithLogs){return resultsWithLogs.map(formatFailure).join(blankLine)+blankLine+countPasses(numPassed)+`, but debugging instrumentation is present.
Remove it before shipping.`}__name(suitePassedWithInstrumentation,"suitePassedWithInstrumentation");function countPasses(n){switch(n){case 1:return"The test passed";case 2:return"Both tests passed";default:return`All ${n} tests passed`}}__name(countPasses,"countPasses");function formatFailure({test:test2,error,instrumentLog}){const sections=[test2.subject+" "+test2.scenario];return instrumentLog.length&&sections.push(indent(2,formatDebugLog(instrumentLog))),error&&sections.push(indent(2,formatError(error))),sections.join(`
`)}__name(formatFailure,"formatFailure");function formatError(error){return error instanceof ExpectationFailure?formatExpectationFailure(error):formatException(error)}__name(formatError,"formatError");function formatDebugLog(log){return log.map(({args})=>formatFunctionCall("debug",args)).join("")}__name(formatDebugLog,"formatDebugLog");function formatExpectationFailure(error){return formatFunctionCall("expect",error.expectArgs)}__name(formatExpectationFailure,"formatExpectationFailure");function formatException(error){return pretty(error)+" thrown"+indent(2,simplifyStacktrace(error.stack))}__name(formatException,"formatException");function formatFunctionCall(name,args){return formatStructure(name+"(",args.map(pretty),",",")")}__name(formatFunctionCall,"formatFunctionCall");function simplifyStacktrace(stack){if(!stack)return"";const lines2=trimMargin(stack).split(`
`);return`
`+lines2.slice(0,indexOfFirstIrrelevantStackFrame(lines2)).map(line=>line.replace(/(file:\/\/|http:\/\/[^/]*)/,"").replace(/^([^@]*)@(.*)$/,"at $1 ($2)")).join(`
`)}__name(simplifyStacktrace,"simplifyStacktrace");function indexOfFirstIrrelevantStackFrame(lines2){const i=lines2.findIndex(l=>l.includes("errorFrom"));return i===-1?lines2.length:i}__name(indexOfFirstIrrelevantStackFrame,"indexOfFirstIrrelevantStackFrame");const basePassingTest=Object.freeze({test:{subject:"a thing",scenario:"does something",fn(){}},error:void 0,instrumentLog:[]});function expectOutput(testResults,expected){expect(formatTestResultsAsText({results:testResults}),is$2,expected)}__name(expectOutput,"expectOutput");test("formatTestResultsAsText",{"given no tests"(){expectOutput([],"No tests to run.")},"given one passing test"(){expectOutput([basePassingTest],"One test ran, and found no issues.")},"given multiple passing tests"(){expectOutput([basePassingTest,basePassingTest],"2 tests ran, and found no issues.")},"given a failing test"(){const testResults=[{...basePassingTest,error:new ExpectationFailure([1,is$2,2])}];expectOutput(testResults,trimMargin`
      a thing does something
        expect(
          1,
          is,
          2
        )

      Tests failed.
    `)},"given multiple failing tests"(){const testResults=[{...basePassingTest,error:new ExpectationFailure([1,is$2,2])},{...basePassingTest,test:{...basePassingTest.test,scenario:"does a second thing"},error:new ExpectationFailure([3,is$2,4])}];expectOutput(testResults,trimMargin`
      a thing does something
        expect(
          1,
          is,
          2
        )

      a thing does a second thing
        expect(
          3,
          is,
          4
        )

      Tests failed.
    `)},"shows debug logs"(){const testResults=[{...basePassingTest,instrumentLog:[{type:"debug",args:["hello"]}]}];expectOutput(testResults,trimMargin`
      a thing does something
        debug("hello")

      The test passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)},"shows debug logs for two tests"(){const testResults=[{...basePassingTest,instrumentLog:[{type:"debug",args:["hello"]}]},{...basePassingTest,instrumentLog:[{type:"debug",args:["blah"]}]}];expectOutput(testResults,trimMargin`
      a thing does something
        debug("hello")

      a thing does something
        debug("blah")

      Both tests passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)},"shows debug logs for three tests"(){const testResults=[{...basePassingTest,instrumentLog:[{type:"debug",args:["hello"]}]},{...basePassingTest,instrumentLog:[{type:"debug",args:["blah"]}]},{...basePassingTest}];expectOutput(testResults,trimMargin`
      a thing does something
        debug("hello")

      a thing does something
        debug("blah")

      All 3 tests passed, but debugging instrumentation is present.
      Remove it before shipping.
    `)},"shows debug logs in the presence of failures"(){const testResults=[{...basePassingTest,instrumentLog:[{type:"debug",args:["hello"]}],error:new ExpectationFailure([1,is$2,2])},{...basePassingTest,instrumentLog:[{type:"debug",args:["blah"]}]},{...basePassingTest,error:new ExpectationFailure([3,is$2,4])}];expectOutput(testResults,trimMargin`
      a thing does something
        debug("hello")
        expect(
          1,
          is,
          2
        )

      a thing does something
        debug("blah")

      a thing does something
        expect(
          3,
          is,
          4
        )

      Tests failed.
    `)},"formats an error with a Firefox stacktrace"(){const error=new Error("test error");error.stack=trimMargin`
      kablooie@http://localhost:8080/src/plain-text-test-formatter.js:217:13
      formats an error with a stacktrace@http://localhost:8080/src/plain-text-test-formatter.js:221:7
      errorFrom@http://localhost:8080/src/test-runner.js:15:9
      result@http://localhost:8080/src/test-runner.js:24:26
      runTests@http://localhost:8080/src/test-runner.js:20:26
      runAndFormat@http://localhost:8080/:14:49
      @http://localhost:8080/:17:22
    `;const testResults=[{...basePassingTest,error}];expectOutput(testResults,trimMargin`
      a thing does something
        Error("test error") thrown
          at kablooie (/src/plain-text-test-formatter.js:217:13)
          at formats an error with a stacktrace (/src/plain-text-test-formatter.js:221:7)

      Tests failed.
    `)},"formats an error with a Chrome stacktrace"(){const error=new Error("test error");error.stack=trimMargin`
      Error: test error
          at repeats a string zero times (formatting.js:14)
          at errorFrom (test-runner.impl.js:42)
          at runTests (test-runner.impl.js:6)
          at async (index):17
    `;const testResults=[{...basePassingTest,error}];expectOutput(testResults,trimMargin`
      a thing does something
        Error("test error") thrown
          Error: test error
              at repeats a string zero times (formatting.js:14)

      Tests failed.
    `)},"formats an error thrown from async code on Firefox"(){const error=new Error("test error");error.stack=trimMargin`
      repeats a string zero times@http://localhost:8080/src/formatting.js:15:11
      async*errorFrom@http://localhost:8080/src/test-runner.impl.js:42:20
      runTests@http://localhost:8080/src/test-runner.impl.js:6:25
      async*@http://localhost:8080/:17:23
    `;const testResults=[{...basePassingTest,error}];expectOutput(testResults,trimMargin`
      a thing does something
        Error("test error") thrown
          at repeats a string zero times (/src/formatting.js:15:11)

      Tests failed.
    `)},"formats an error thrown from async code on Chrome"(){const error=new Error("test error");error.stack=trimMargin`
      Error: test error
          at repeats a string zero times (formatting.js:15)
    `;const testResults=[{...basePassingTest,error}];expectOutput(testResults,trimMargin`
      a thing does something
        Error("test error") thrown
          Error: test error
              at repeats a string zero times (formatting.js:15)

      Tests failed.
    `)},"formats a throwable without a stacktrace"(){const testResults=[{...basePassingTest,error:"test error"}];expectOutput(testResults,trimMargin`
      a thing does something
        "test error" thrown

      Tests failed.
    `)}});test("formatFunctionCall",{"given no function args"(){expect(formatFunctionCall("myFunc",[]),is$2,"myFunc()")},"given one arg"(){expect(formatFunctionCall("myFunc",["a"]),is$2,'myFunc("a")')},"given multiple args"(){expect(formatFunctionCall("myFunc",["a","b"]),is$2,trimMargin`
      myFunc(
        "a",
        "b"
      )
    `)}});test("reportsFailure",{"given success"(){expect(reportsFailure("10 tests ran"),is$2,!1)},"given failure"(){expect(reportsFailure("Tests failed"),is$2,!0)},"matches 'fail' case insensitively"(){expect("FAIL",reportsFailure),expect("A FAILURE",reportsFailure),expect("fail",reportsFailure),expect("something failed",reportsFailure),expect("f",not(reportsFailure))}});const eq=__name((a,b)=>a===b,"eq");test("equals",{"compares primitives"(){expect(equals(1,1),is$2,!0),expect(equals(1,2),is$2,!1)},"compares nulls"(){expect(equals(null,null),is$2,!0)},"compares undefineds"(){expect(equals(void 0,void 0),is$2,!0)},"treats null and undefined as different"(){expect(equals(null,void 0),is$2,!1)},"compares bigints"(){expect(equals(BigInt("10"),BigInt("99")),is$2,!1),expect(equals(BigInt("10"),BigInt("10")),is$2,!0)},"compares bigints to numbers"(){expect(equals(BigInt("10"),10),is$2,!1)},"is curried"(){expect(1,equals(1)),expect(1,not(equals(2)))},"given empty arrays"(){expect([],equals,[])},"given arrays of different lengths"(){expect([1],not(equals([]))),expect([],not(equals([1])))},"given arrays with different elements"(){expect([1],not(equals([2])))},"given equal arrays"(){expect([1,2,3],equals,[1,2,3])},"given equal nested arrays"(){expect([1,[2,3],4],equals,[1,[2,3],4])},"given unequal nested arrays"(){expect([1,[2,5],4],not(equals([1,[2,3],4])))},"given an array and a non-array"(){expect([1],not(equals(null))),expect(null,not(equals([1])))},"given empty objects"(){expect({},equals,{})},"given an array and an object"(){expect({},not(equals([]))),expect([],not(equals({})))},"given objects with different numbers of keys"(){expect({foo:1},not(equals({}))),expect({},not(equals({foo:1})))},"given objects with different sets of keys"(){expect({foo:1},not(equals({bar:1}))),expect({bar:1},not(equals({foo:1})))},"given objects with the same keys but different values"(){expect({foo:1},not(equals({foo:2})))},"given equal objects"(){expect({foo:1,bar:2},equals({foo:1,bar:2}))},"doesn't care about key order"(){expect({bar:2,foo:1},equals({foo:1,bar:2}))},"deep-compares objects"(){expect({bar:{foo:1}},equals({bar:{foo:1}}))},"given classes"(){class ClassOne{static{__name(this,"ClassOne")}}class ClassTwo{static{__name(this,"ClassTwo")}}expect(ClassOne,equals,ClassOne),expect(ClassTwo,not(equals(ClassOne)))},"given instances of different classes"(){class ClassOne{static{__name(this,"ClassOne")}}class ClassTwo{static{__name(this,"ClassTwo")}}expect(new ClassOne,not(equals(new ClassTwo)))},"given instances of the same class"(){class ClassOne{static{__name(this,"ClassOne")}}expect(new ClassOne,equals(new ClassOne))},"given instances of the same class with different data"(){class ClassOne{static{__name(this,"ClassOne")}constructor(_x){this.x=_x}}expect(new ClassOne(1),not(equals(new ClassOne(2))))},"given a subclass instance and a superclass instance"(){class Superclass{static{__name(this,"Superclass")}}class Subclass extends Superclass{static{__name(this,"Subclass")}}expect(new Superclass,not(equals(new Subclass))),expect(new Subclass,not(equals(new Superclass)))},"given different functions"(){expect(()=>{},not(equals(()=>{})))},"given the same function"(){expect(equals,equals,equals)},"given partially applied functions with equal arguments"(){expect(equals({foo:1}),equals,equals({foo:1}))},"given partially applied functions with different arguments"(){expect(equals({foo:2}),not(equals(equals({foo:1}))))},"given different dates"(){expect(new Date("1999-12-21"),not(equals(new Date("2001-12-22"))))},"given equal dates"(){expect(new Date("1999-12-21"),equals(new Date("1999-12-21")))},"given objects with no prototypes"(){expect(Object.create(null),equals(Object.create(null)))},"given different sets"(){expect(new Set([1]),not(equals(new Set))),expect(new Set([1,2]),not(equals(new Set([1,3]))))},"given equal sets"(){expect(new Set([1,2]),equals(new Set([2,1])))},"given Errors with equal messages"(){expect(new Error("a"),equals(new Error("a")))},"given instances of an Error subclass with equal messages"(){class TestError extends Error{static{__name(this,"TestError")}}expect(new TestError("a"),equals(new TestError("a")))},"given errors with different messages"(){expect(new Error("a"),not(equals(new Error("b"))))},"given errors with different classes"(){class TestError extends Error{static{__name(this,"TestError")}}expect(new Error("a"),not(equals(new TestError("a"))))},"given a custom matcher"(){const contains=curry(__name(function(needle,haystack){return haystack.includes(needle)},"contains"));expect({foo:"hello"},equals,{foo:which(contains("ell"))}),expect({foo:"blah"},not(equals({foo:which(contains("ell"))})))},"if you mistakenly use `which` without passing arguments"(){expect({foo:"hello"},not(equals({foo:which})))},"is named"(){expect(functionName(equals),is$2,"equals")}});test("is",{"returns true if its args are equal"(){expect(is$2(1,1),eq,!0)},"returns false if its args are unequal"(){expect(is$2(1,2),eq,!1),expect(is$2(2,1),eq,!1)},"performs exact comparison"(){expect(is$2(1,"1"),eq,!1),expect(is$2("1",1),eq,!1)},"compares by pointer equality"(){expect(is$2({},{}),eq,!1)},"is named"(){expect(functionName(is$2),is$2,"is")}});test("not",{"inverts the given predicate"(){expect(not(is$2(1))(2),eq,!0),expect(not(is$2(1))(1),eq,!1)},"inverts twice"(){expect(1,not(not(is$2(1))))},"inverts a binary predicate"(){const isNot=not(is$2);expect(1,isNot,2),expect(1,not(isNot),1)},"is named"(){expect(functionName(not),is$2,"not")}});test("which",{"is named"(){expect(functionName(which),is$2,"which")}});test("isBlank",{"is true for the empty string"(){expect(isBlank(""),is$2,!0)},"is false for a string with visible characters"(){expect(isBlank("a"),is$2,!1)},"is true for whitespace"(){expect(isBlank(` 	
\r`),is$2,!0)},"is false for a string with both visible characters and spaces"(){expect(isBlank(" not blank "),is$2,!1)},"is named"(){expect(functionName(isBlank),is$2,"isBlank")}});async function runTests(tests){const results2=[];for(const test2 of tests){const error=await errorFrom(test2.fn),instrumentLog=debugLogs.map(args=>({type:"debug",args}));debugLogs.length=0,results2.push({test:test2,error,instrumentLog})}return{results:results2}}__name(runTests,"runTests");function errorFrom(f){let caught;try{const result=f();if(result instanceof Promise)return new Promise(resolve=>{result.then(()=>resolve()).catch(resolve)})}catch(e){caught=e}return Promise.resolve(caught)}__name(errorFrom,"errorFrom");const debugLogs=[];function debug(...args){debugLogs.push(args)}__name(debug,"debug");function isDefined(x){return typeof x<"u"}__name(isDefined,"isDefined");const isExpectationFailure=curry(__name(function(args,error){return error instanceof ExpectationFailure&&equals(args,error.expectArgs)},"isExpectationFailure"));test("runTests",{async"given no tests"(){expect(await runTests([]),equals,{results:[]})},async"given a passing test"(){const dummyTestFn=__name(()=>{},"dummyTestFn"),{results:results2}=await runTests([{subject:"a thing",scenario:"does something",fn:dummyTestFn}]);expect(results2,equals,[{test:{subject:"a thing",scenario:"does something",fn:dummyTestFn},error:void 0,instrumentLog:[]}])},async"given a failing test"(){const{results:results2}=await runTests([{subject:"a thing",scenario:"does something",fn(){expect(!1,is$2,!0)}}]);expect(results2,equals,[{test:which(isDefined),error:which(isExpectationFailure([!1,is$2,!0])),instrumentLog:[]}])},async"given a test that debugs"(){const{results:results2}=await runTests([{subject:"a thing",scenario:"does something",fn(){debug("hello","there"),debug("another")}}]);expect(results2,equals,[{test:which(isDefined),error:void 0,instrumentLog:[{type:"debug",args:["hello","there"]},{type:"debug",args:["another"]}]}]),debugLogs.length=0},async"given an async test that debugs"(){const{results:results2}=await runTests([{subject:"a thing",scenario:"does something",async fn(){debug("before await"),await Promise.resolve(),debug("after await")}}]);expect(results2,equals,[{test:which(isDefined),error:void 0,instrumentLog:[{type:"debug",args:["before await"]},{type:"debug",args:["after await"]}]}])}});test("debug logging",{"logs all args passed"(){debug("arg 1","arg 2"),expect(debugLogs,equals,[["arg 1","arg 2"]]),debugLogs.length=0}});function is(a,b){return a===b}__name(is,"is");function isEmpty(a){return a.length===0}__name(isEmpty,"isEmpty");function isOne(x){return x===1}__name(isOne,"isOne");test("expect",{"doesn't throw if the expectation is met"(){expect(1,isOne)},"throws if the expectation isn't met"(){let caught;try{expect(2,isOne)}catch(e){caught=e}if(!caught)throw new Error("nothing thrown")},"passes extra args to the expectation"(){expect(1,is,1)},"works with asymmetric comparisons"(){const greaterThan=__name((a,b)=>b>a,"greaterThan"),greaterThanCurried=__name(a=>b=>greaterThan(a,b),"greaterThanCurried");expect(2,greaterThan,1),expect(2,greaterThanCurried(1))},"throws if extra args don't meet the expectation"(){let caught;try{expect(2,is,1)}catch(e){caught=e}if(!caught)throw new Error("nothing thrown")},"throws if you forget part of the assertion"(){const curriedIs=__name(a=>b=>a===b,"curriedIs");let caught;try{expect(1,curriedIs)}catch(e){caught=e}if(!caught)throw new Error("nothing thrown");expect(caught.message,is,"The matcher function `<function>` returned a function instead of a boolean. You might need to pass another argument to it.")}});test("a suite",{"starts with no tests"(){expect(createSuite().getAllTests(),isEmpty)},"registers tests independently of other suites"(){const theSuite=createSuite();theSuite.test("some object",{"does something"(){}});const firstTest=theSuite.getAllTests()[0];expect(firstTest.subject,is,"some object"),expect(firstTest.scenario,is,"does something");const aDifferentSuite=createSuite();expect(aDifferentSuite.getAllTests(),isEmpty)}});const results=await runTests(getAllTests()),output=formatTestResultsAsText(results);testOutput.innerText=output;document.title="Taste - "+summaryOf(output);function summaryOf(output2){return reportsFailure(output2)?"FAILED":output2}__name(summaryOf,"summaryOf");
