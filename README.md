# Deno Bencode

A deno library for encoding and decoding bencoded data, according to the [Unofficial BitTorrentSpecification](https://wiki.theory.org/BitTorrentSpecification).

## Usage

```typescript
import { encode, decode } from "https://deno.land/x/bencode@v0.1.2/mod.ts"

const encoded = encode({
  str: "deno_bencode",
  num: 1,
  uint8Array: new Uint8Array([1, 2, 3]),
  object: {
    str: "object",
  },
  arr: ["arr", 1],
})
console.log(encoded)
// Uint8Array(86) [
//   100,  51,  58,  97, 114, 114, 108,  51,  58,  97, 114, 114, 105,
//    49, 101, 101,  51,  58, 110, 117, 109, 105,  49, 101,  54,  58,
//   111,  98, 106, 101,  99, 116, 100,  51,  58, 115, 116, 114,  54,
//    58, 111,  98, 106, 101,  99, 116, 101,  51,  58, 115, 116, 114,
//    49,  50,  58, 100, 101, 110, 111,  95,  98, 101, 110,  99, 111,
//   100, 101,  49,  48,  58, 117, 105, 110, 116,  56,  65, 114, 114,
//    97, 121,  51,  58,   1,   2,   3, 101
// ]

console.log(decode(encoded))
// {
//   arr: [ "arr", 1 ],
//   num: 1,
//   object: { str: "object" },
//   str: "deno_bencode",
//   uint8Array: "\x01\x02\x03"
// }
```

## Encode && Decode

```typescript
type bencodeValue = string | Uint8Array | number | { [key: string]: bencodeValue } | bencodeValue[]

const encode = (data: bencodeValue | bencodeValue[]): Uint8Array

const decode = (payload: ArrayBufferView | ArrayBuffer | string): bencodeValue
```

### About byte string 

If byte string is a valid utf-8 string, it will be decoded with `TextDecoder`. Otherwise, it is returned as `Uint8Array`.