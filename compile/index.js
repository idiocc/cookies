const _Cookies = require('./cookies')

class Cookies extends _Cookies.Cookies {
  /**
   * @param {!http.IncomingMessage} request
   * @param {!http.ServerResponse} response
   * @param {!_goa.CookiesOptions} [options] Options for the constructor.
   * @param {!(Array<string>|_goa.Keygrip)} [options.keys] The array of keys, or the `Keygrip` object.
   * @param {boolean} [options.secure] Explicitly specifies if the connection is secure, rather than this module examining request.
   */
  constructor(request, response, options) {
    super(request, response, options)
  }
  /**
   * This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned.
   * @param {string} name The name of the cookie to get.
   * @param {{ signed: boolean }} [opts] The options.
   * @return {string}
   */
  get(name, opts) {
    return super.get(name, opts)
  }
  /**
   * @param {string} name The name of the cookie to set.
   * @param {String} [value] The value of the cookie to set.
   * @param {!_goa.CookieAttributes} [opts] Used to generate the outbound cookie header.
   * @param {number} [opts.maxAge] Represents the milliseconds from Date.now() for expiry.
   * @param {!Date} [opts.expires] Indicates the cookie's expiration date (expires at the end of session by default).
   * @param {string} [opts.path="/"] Indicates the path of the cookie. Default `/`.
   * @param {string} [opts.domain] Indicates the domain of the cookie.
   * @param {boolean} [opts.secure] Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
   * @param {number} [opts.httpOnly=true] Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
   * @param {boolean|string} [opts.sameSite=false] Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`). Default `false`.
   * @param {boolean} [opts.signed=false] Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. Default `false`.
   * @param {boolean} [opts.overwrite=false] Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. Default `false`.
   */
  set(name, value, options) {
    return super.set(name, value, options)
  }
}

class Keygrip extends _Cookies.Keygrip {
  /**
   * This creates a new Keygrip based on the provided keylist, an array of secret keys used for SHA1 HMAC digests. `keylist` is obligatory. `hmacAlgorithm` defaults to 'sha1' and `encoding` defaults to 'base64'.
   * @param {!Array<string>} keylist An array of all valid keys for signing, in descending order of freshness; new keys should be unshifted into the array and old keys should be popped.
   * @param {string} [hmacAlgorithm="sha1"] Default `sha1`.
   * @param {string} [encoding="base64"] Default `base64`.
   */
  constructor(keylist, hmacAlgorithm, encoding) {
    super(keylist, hmacAlgorithm, encoding)
  }
  /**
   * This creates a SHA1 HMAC based on the first key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).
   * @param {?} data The data to sign.
   * @return {string}
   */
  sign(data) {
    return super.sign(data)
  }
  /**
   * This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, `-1` is returned.
   * The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges.
   * @param {?} data The data to look for.
   * @param {string} digest The digest to find.
   * @return {number} The index of the found key.
   */
  index(data, digest) {
    return super.index(data, digest)
  }
  /**
   * This uses index to return `true` if the digest matches any existing keys, and `false` otherwise.
   * @param {?} data The data to look for.
   * @param {string} digest The data's digest.
   * @returns {boolean}
   */
  verify(data, digest) {
    return super.verify(data, digest)
  }
}

/**
 * Creates connect middleware that adds the `cookies` property on the request and response.
 * @param {!(Array<string>|_goa.Keygrip)} keys The keys or Keygrip object.
 */
const express = (keys) => {
  return _Cookies.express(keys)
}
/**
 * Creates connect middleware that adds the `cookies` property on the request and response.
 * @param {!(Array<string>|_goa.Keygrip)} keys The keys or Keygrip object.
 */
const connect = (keys) => {
  return _Cookies.connect(keys)
}

module.exports = Cookies
module.exports.Keygrip = Keygrip
module.exports.express = express
module.exports.connect = connect

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').CookieAttributes} _goa.CookieAttributes
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').CookiesOptions} _goa.CookiesOptions
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').Keygrip} _goa.Keygrip
 */
