const _Cookies = require('./depack')

class Cookies extends _Cookies {
  /**
   * @param {!http.IncomingMessage} request
   * @param {!http.ServerResponse} response
   * @param {!_goa.CookiesOptions} [options] Options for the constructor.
   * @param {!(Array<string>|_goa.Keygrip)} options.keys The array of keys, or the `Keygrip` object.
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

console.log('testing depack')

module.exports = Cookies

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
