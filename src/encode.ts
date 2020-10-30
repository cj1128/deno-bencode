import { assert } from "../test/deps.ts"
import { cmpRawString } from "./util.ts"

export type bencodeValue = string | Uint8Array | number | { [key: string]: bencodeValue } | bencodeValue[]

const te = new TextEncoder()

const encodeString = (str: string): Uint8Array => {
  const buf = new Deno.Buffer()
  const content = te.encode(str)

  buf.writeSync(te.encode(content.length.toString()))
  buf.writeSync(te.encode(":"))
  buf.writeSync(content)

  return buf.bytes()
}

const encodeBuf = (buf: Uint8Array): Uint8Array => {
  const result = new Deno.Buffer()
  result.writeSync(te.encode(buf.byteLength.toString()))
  result.writeSync(te.encode(":"))
  result.writeSync(buf)
  return result.bytes()
}

const encodeNumber = (num: number): Uint8Array => {
  // NOTE: only support integers
  num = num >> 0

  const buf = new Deno.Buffer()
  buf.writeSync(te.encode("i"))
  buf.writeSync(te.encode(num.toString()))
  buf.writeSync(te.encode("e"))

  return buf.bytes()
}

const encodeDictionary = (obj: { [key: string]: bencodeValue }): Uint8Array => {
  const buf = new Deno.Buffer()
  buf.writeSync(te.encode("d"))

  Object.keys(obj).sort(cmpRawString).forEach(key => {
    buf.writeSync(encodeString(key))
    buf.writeSync(new Uint8Array(encode(obj[key])))
  })

  buf.writeSync(te.encode("e"))
  return buf.bytes()
}

const encodeArray = (arr: bencodeValue[]): Uint8Array => {
  const buf = new Deno.Buffer()
  buf.writeSync(te.encode("l"))

  for (let r of arr.map(encode)) {
    buf.writeSync(r)
  }

  buf.writeSync(te.encode("e"))
  return buf.bytes()
}

const encode = (data: bencodeValue | bencodeValue[]): Uint8Array => {
  if (Array.isArray(data)) {
    return encodeArray(data)
  } else {
    switch (typeof data) {
      case "string": {
        return encodeString(data)
      }

      case "number": {
        return encodeNumber(data)
      }

      case "object": {
        if (data instanceof Uint8Array) {
          return encodeBuf(data)
        }

        return encodeDictionary(data)
      }

      default: {
        throw new Error(`unsupport data type: ${typeof data}`)
      }
    }
  }
}

export default encode