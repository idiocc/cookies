/*!
 * keygrip
 * Copyright(c) 2011-2014 Jed Schmidt
 * MIT Licensed
 */

import { createHmac } from 'crypto'

export default class Keygrip {
  constructor(keys, algorithm = 'sha1', encoding = 'base64') {
    if (!keys || !(0 in keys)) {
      throw new Error('Keys must be provided.')
    }
    this.algorithm = algorithm
    this.encoding = encoding
    this.keys = keys
  }
  sign(data) {
    return sign(data, this.algorithm, this.keys[0], this.encoding)
  }
  verify(data, digest) {
    return this.index(data, digest) > -1
  }
  index(data, digest) {
    for (let i = 0, l = this.keys.length; i < l; i++) {
      const sig = sign(data, this.algorithm, this.keys[i], this.encoding)
      if (constantTimeCompare(digest, sig)) return i
    }

    return -1
  }
}

function sign(data, algorithm, key, encoding) {
  return createHmac(algorithm, key)
    .update(data).digest(encoding)
    .replace(/\/|\+|=/g, (x) => {
      return ({ '/': '_', '+': '-', '=': '' })[x]
    })
}

// http://codahale.com/a-lesson-in-timing-attacks/
const constantTimeCompare = function(val1, val2){
  if (val1 == null && val2 != null){
    return false
  } else if (val2 == null && val1 != null){
    return false
  } else if (val1 == null && val2 == null){
    return true
  }

  if(val1.length != val2.length){
    return false
  }

  var result = 0

  for (var i = 0; i < val1.length; i++) {
    result |= val1.charCodeAt(i) ^ val2.charCodeAt(i) //Don't short circuit
  }

  return result === 0
}
