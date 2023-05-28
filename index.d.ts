declare module "@benchristel/taste" {
  export function curry<A1, A2, Ret>(
    f: (a1: A1, a2: A2) => Ret,
    name: string,
  ): Curried2<A1, A2, Ret>
  export function curry<A1, A2, A3, Ret>(
    f: (a1: A1, a2: A2, a3: A3) => Ret,
    name: string,
  ): Curried3<A1, A2, A3, Ret>
  export function equals(a: any, b: any): boolean
  export function equals(a: any): (b: any) => boolean
  export function test(
    subject: string,
    examples: {[title: string]: () => unknown},
  ): void
  export function expect<A>(
    actual: A,
    matcher: (a: A) => unknown,
  ): void
  export function expect<A, B>(
    actual: A,
    matcher: (b: B, a: A) => unknown,
    expected: B,
  ): void
  export function expect<A, B, C>(
    actual: A,
    matcher: (b: B, c: C, a: A) => unknown,
    expected: B,
    arg1: C,
  ): void
  export function expect<A, B, C, D>(
    actual: A,
    matcher: (b: B, c: C, d: D, a: A) => unknown,
    expected: B,
    arg1: C,
    arg2: D,
  ): void
  export function is(a: any, b: any): boolean
  export function is(a: any): (b: any) => boolean
  export function not(predicate: Predicate): Predicate
  export function which(predicate: Predicate): any
  export function runTests(
    a: TestList,
  ): Promise<{results: Array<TestResult>}>
  export function getAllTests(): TestList
  export function formatTestResultsAsText(results: any): string
  export function createSuite(): {test: any; getAllTests: any}
  export function debug(value: any): void

  type Predicate = (...args: Array<any>) => any
  type TestList = Array<Test>
  type Test = {subject: string; scenario: string; fn: () => unknown}
  type TestResult = {
    error: Error | null
    instrumentLog: Array<{type: string; [key: string]: any}>
    test: Test
  }
}

type Curried2<A1, A2, Ret> = ((a: A1) => (a: A2) => Ret) &
  ((a: A1, b: A2) => Ret)

type Curried3<A1, A2, A3, Ret> = ((a: A1, b: A2, c: A3) => Ret) &
  ((a: A1, b: A2) => (c: A3) => Ret) &
  ((a: A1) => Curried2<A2, A3, Ret>)
