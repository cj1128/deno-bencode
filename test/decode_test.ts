import { assertEquals, assertThrows } from "./deps.ts"
import { decode, encode } from "../mod.ts"
import * as common from "./common.ts"

Deno.test("should be able to decode an integer", () => {
  assertEquals(decode("i123e"), 123)
  assertEquals(decode("i-123e"), -123)
})

Deno.test(
  "should be throw an error when trying to decode a broken integer",
  () => {
    assertThrows(
      () => {
        decode("i12+3e")
      },
      Error,
      "not a number"
    )

    assertThrows(
      () => {
        decode("i-1+23e")
      },
      Error,
      "not a number"
    )
  }
)

Deno.test(
  "should be throw an error when trying to decode a broken float",
  () => {
    assertThrows(
      () => {
        decode("i1+2.3e")
      },
      Error,
      "not a number"
    )
    assertThrows(
      () => {
        decode("i-1+2.3e")
      },
      Error,
      "not a number"
    )
  }
)

Deno.test("should be able to decode a string", () => {
  assertEquals(decode("5:asdfe"), "asdfe")
  assertEquals(decode(common.testStringResult), common.testString)
})

Deno.test("should be able to decode a dictionary", () => {
  assertEquals(decode("d3:cow3:moo4:spam4:eggse"), {
    cow: "moo",
    spam: "eggs",
  })

  assertEquals(decode("d4:spaml1:a1:bee"), {
    spam: ["a", "b"],
  })

  assertEquals(
    decode(
      "d9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee"
    ),
    {
      publisher: "bob",
      "publisher-webpage": "www.example.com",
      "publisher.location": "home",
    }
  )
})

Deno.test("should be able to decode a list", () => {
  assertEquals(decode("l4:spam4:eggse"), ["spam", "eggs"])
})

Deno.test("should get exactly same content by encode(decode(buf))", () => {
  const buf = encode({ name: "hello", age: 18 })
  assertEquals(encode(decode(buf)), buf)
})
