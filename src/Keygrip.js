import { sign } from './keygrip-lib/sign'
import { constantTimeCompare } from './keygrip-lib/ctc'

/* start example */
/**
 * @implements {_goa.Keygrip}
 */
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
/* end example */

/*!
 * keygrip
 * Copyright(c) 2011-2014 Jed Schmidt
 * MIT Licensed
 */
