import {curry, equals, test, expect} from "@benchristel/taste"

function assertAssignableTo<T>(a: T) {}

// Tests for curry()
;() => {
  // @ts-expect-error
  curry()

  // @ts-expect-error
  curry("fail")

  curry(() => {})

  curry(() => {}, "theFunctionName")

  assertAssignableTo<(a: 1) => number>(
    curry((a: 1) => 0),
  )

  assertAssignableTo<(a: false) => number>(
    // @ts-expect-error
    curry((a: 1) => 0),
  )

  assertAssignableTo<(a: 1) => false>(
    // @ts-expect-error
    curry((a: 1) => 0),
  )

  assertAssignableTo<(a: 1, b: 2) => number>(
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2) => number>(
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: 1) => (b: false) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: false) => (b: 2) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: 1, b: 2) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: false, b: 2) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2) => 0),
  )

  assertAssignableTo<(a: 1, b: 2, c: 3) => number>(
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2, c: 3) => number>(
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2) => (c: 3) => number>(
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1, b: 2) => (c: 3) => number>(
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1, b: 2, c: 3) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: false, b: 2, c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2, c: 3) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: false) => (b: 2, c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: false, c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2, c: false) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2) => (c: 3) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: false) => (b: 2) => (c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: false) => (c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1) => (b: 2) => (c: false) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1, b: 2) => (c: 3) => false>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: false, b: 2) => (c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1, b: false) => (c: 3) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )

  assertAssignableTo<(a: 1, b: 2) => (c: false) => number>(
    // @ts-expect-error
    curry((a: 1, b: 2, c: 3) => 0),
  )
}

// Tests for equals()
;() => {
  assertAssignableTo<boolean>(equals(1, 2));

  assertAssignableTo<(a: unknown) => boolean>(equals(1));
}

// Tests for test()
;() => {
  // @ts-expect-error
  test()

  // @ts-expect-error
  test("the-subject")

  // @ts-expect-error
  test("the-subject", [])

  test("the-subject", {})

  test("the-subject", {
    "works"() {}
  })

  test("the-subject", {
    // @ts-expect-error
    "works"(a: string) {}
  })
}

// Tests for expect()
;() => {
  // @ts-expect-error
  expect(1)

  // @ts-expect-error
  expect(1, 2)

  expect(1, equals(2))

  expect(1, equals, 2)

  expect(1, (a: 2, b: 3, c: 1) => true, 2, 3)

  expect(1, (a: 2, b: 3, c: 4, d: 1) => true, 2, 3, 4)

  // @ts-expect-error
  expect(1, (a: 2, b: 3, c: 1) => true, 2, false)

  // @ts-expect-error
  expect(1, (a: 2, b: 3, c: 1) => true, false, 3)

  // @ts-expect-error
  expect(false, (a: 2, b: 3, c: 1) => true, 2, 3)

  // @ts-expect-error
  expect(false, (a: 2, b: 3, c: 3, d: 1) => true, 2, 3)
}
