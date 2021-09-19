import { assertEquals, assert, assertThrows } from "./deps.ts"
import { encode } from "../mod.ts"
import * as common from "./common.ts"

const te = new TextEncoder()
const td = new TextDecoder()

Deno.test("should always return a Uint8Array", () => {
  assert(encode("hello") instanceof Uint8Array)
  assert(encode(123) instanceof Uint8Array)
  assert(encode({}) instanceof Uint8Array)
  assert(encode([3, 2]) instanceof Uint8Array)
  assert(encode({ a: "b", 3: 6 }) instanceof Uint8Array)
})

Deno.test("should sort dictionaries", () => {
  const data = { string: "Hello World", integer: 12345 }
  assertEquals(
    td.decode(encode(data)),
    "d7:integeri12345e6:string11:Hello Worlde"
  )
})

Deno.test("should force keys to be strings", () => {
  const data = {
    12: "Hello World",
    34: 12345,
  }

  assertEquals(td.decode(encode(data)), "d2:1211:Hello World2:34i12345ee")
})

Deno.test("should be able to encode integers", () => {
  assertEquals(td.decode(encode(123)), "i123e")
})

// https://github.com/cj1128/deno-bencode/issues/1
Deno.test("should be able to encode large integers", () => {
  const large = 2500000000
  assertEquals(td.decode(encode(large)), "i2500000000e")
})

Deno.test("should throw if encode non integers", () => {
  assertThrows(
    () => {
      encode(1.2)
    },
    Error,
    "only support integers"
  )
})

Deno.test("should be able to encode a Uint8Array", () => {
  const arr = new Uint8Array([1, 2, 3, 4])
  assertEquals(encode(arr), new Uint8Array([...te.encode("4:"), ...arr]))
})

Deno.test("should be able to encode a string", () => {
  assertEquals(td.decode(encode("asdf")), "4:asdf")
  assertEquals(td.decode(encode(":asdf:")), "6::asdf:")
})

Deno.test("should be able to encode a unicode string", () => {
  assertEquals(encode(common.testString), common.testStringResult)
})

Deno.test("should be able to encode an array", () => {
  assertEquals(td.decode(encode([32, 12])), "li32ei12ee")
  assertEquals(td.decode(encode([":asdf:"])), "l6::asdf:e")
})

Deno.test("should be able to encode an object", () => {
  assertEquals(td.decode(encode({ a: "bc" })), "d1:a2:bce")
  assertEquals(td.decode(encode({ a: "45", b: 45 })), "d1:a2:451:bi45ee")
})
