let td = new TextDecoder()
let te = new TextEncoder()

// str1 > str2: 1
// str1 === str2: 0
// str1 < str2: -1
export const cmpRawString = (str1: string, str2: string): number => {
  const te = new TextEncoder()
  const v1 = te.encode(str1)
  const v2 = te.encode(str2)

  for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
    if (v1[i] < v2[i]) return -1
    if (v1[i] > v2[i]) return 1
  }

  if (v1.length === v2.length) return 0

  return v1.length < v2.length ? -1 : 1
}

export const typedArraysAreEqual = <T extends Uint8Array>(a: T, b: T): boolean => {
  if (a.byteLength !== b.byteLength) return false
  return a.every((val, i) => val === b[i])
}

// Copied from https://github.com/hcodes/isutf8/blob/master/src/index.ts
/*
    https://tools.ietf.org/html/rfc3629
    UTF8-char = UTF8-1 / UTF8-2 / UTF8-3 / UTF8-4
    UTF8-1    = %x00-7F
    UTF8-2    = %xC2-DF UTF8-tail
    UTF8-3    = %xE0 %xA0-BF UTF8-tail
                %xE1-EC 2( UTF8-tail )
                %xED %x80-9F UTF8-tail
                %xEE-EF 2( UTF8-tail )
    UTF8-4    = %xF0 %x90-BF 2( UTF8-tail )
                %xF1-F3 3( UTF8-tail )
                %xF4 %x80-8F 2( UTF8-tail )
    UTF8-tail = %x80-BF
*/
export const isValidUTF8 = (buf: Uint8Array): boolean => {
  let i = 0
  const len = buf.length

  while (i < len) {
    // UTF8-1 = %x00-7F
    if (buf[i] <= 0x7F) {
      i++

      continue
    }

    // UTF8-2 = %xC2-DF UTF8-tail
    if (buf[i] >= 0xC2 && buf[i] <= 0xDF) {
      // if(buf[i + 1] >= 0x80 && buf[i + 1] <= 0xBF) {
      if (buf[i + 1] >> 6 === 2) {
        i += 2

        continue
      } else {
        return false
      }
    }

    // UTF8-3 = %xE0 %xA0-BF UTF8-tail
    // UTF8-3 = %xED %x80-9F UTF8-tail
    if (
      (
        (buf[i] === 0xE0 && buf[i + 1] >= 0xA0 && buf[i + 1] <= 0xBF) ||
        (buf[i] === 0xED && buf[i + 1] >= 0x80 && buf[i + 1] <= 0x9F)
      ) && buf[i + 2] >> 6 === 2
    ) {
      i += 3

      continue
    }

    // UTF8-3 = %xE1-EC 2( UTF8-tail )
    // UTF8-3 = %xEE-EF 2( UTF8-tail )
    if (
      (
        (buf[i] >= 0xE1 && buf[i] <= 0xEC) ||
        (buf[i] >= 0xEE && buf[i] <= 0xEF)
      ) &&
      buf[i + 1] >> 6 === 2 &&
      buf[i + 2] >> 6 === 2
    ) {
      i += 3

      continue
    }

    // UTF8-4 = %xF0 %x90-BF 2( UTF8-tail )
    //          %xF1-F3 3( UTF8-tail )
    //          %xF4 %x80-8F 2( UTF8-tail )
    if (
      (
        (buf[i] === 0xF0 && buf[i + 1] >= 0x90 && buf[i + 1] <= 0xBF) ||
        (buf[i] >= 0xF1 && buf[i] <= 0xF3 && buf[i + 1] >> 6 === 2) ||
        (buf[i] === 0xF4 && buf[i + 1] >= 0x80 && buf[i + 1] <= 0x8F)
      ) &&
      buf[i + 2] >> 6 === 2 &&
      buf[i + 3] >> 6 === 2
    ) {
      i += 4

      continue
    }

    return false
  }

  return true
}