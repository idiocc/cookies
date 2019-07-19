/**
 * @fileoverview
 * @externs
 */
/* typal types/index.xml externs */
/** @const */
var _goa = {}
/**
 * The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * @interface
 */
_goa.Cookies
/**
 * The keys object constructed from passed keys (private, will be installed
      from options).
 * @type {(!_goa.Keygrip)|undefined}
 */
_goa.Cookies.prototype.keys
/**
 * Explicitly specifies if the connection is secure (private, will be installed
      from options).
 * @type {boolean|undefined}
 */
_goa.Cookies.prototype.secure
/**
 * This extracts the cookie with the given name from the Cookie header in
      the request. If such a cookie exists, its value is returned. Otherwise,
      nothing is returned. `{ signed: true }` can optionally be passed as the
      second parameter options. In this case, a signature cookie (a cookie of same
      name ending with the .sig suffix appended) is fetched. If no such cookie
      exists, nothing is returned.
      If the signature cookie does exist, the provided Keygrip object is used to
      check whether the hash of cookie-name=cookie-value matches that of any
      registered key:
      - If the signature cookie hash matches the first key, the original cookie
      value is returned.
      - If the signature cookie hash matches any other key, the original cookie
      value is returned AND an outbound header is set to update the signature
      cookie's value to the hash of the first key. This enables automatic
      freshening of signature cookies that have become stale due to key rotation.
      - If the signature cookie hash does not match any key, nothing is returned,
      and an outbound header with an expired date is used to delete the cookie.
 * @type {function(string, { signed: boolean }): (string|undefined)}
 */
_goa.Cookies.prototype.get
/**
 * This sets the given cookie in the response and returns the current context
      to allow chaining. If the value is omitted, an outbound header with an
      expired date is used to delete the cookie.
 * @type {function(string, ?string=, _goa.CookieAttributes=)}
 */
_goa.Cookies.prototype.set
/**
 * Options for the constructor.
 * @record
 */
_goa.CookiesOptions
/**
 * The array of keys, or the `Keygrip` object.
 * @type {(!(Array<string>|_goa.Keygrip))|undefined}
 */
_goa.CookiesOptions.prototype.keys
/**
 * Explicitly specifies if the connection is secure, rather than this module
      examining request.
 * @type {boolean|undefined}
 */
_goa.CookiesOptions.prototype.secure
/**
 * Used to generate the outbound cookie header.
 * @record
 */
_goa.CookieAttributes
/**
 * Represents the milliseconds from Date.now() for expiry.
 * @type {number|undefined}
 */
_goa.CookieAttributes.prototype.maxAge
/**
 * Indicates the cookie's expiration date (expires at the end of session by
      default).
 * @type {(!Date)|undefined}
 */
_goa.CookieAttributes.prototype.expires
/**
 * Indicates the path of the cookie. Default `/`.
 * @type {string|undefined}
 */
_goa.CookieAttributes.prototype.path
/**
 * Indicates the domain of the cookie.
 * @type {string|undefined}
 */
_goa.CookieAttributes.prototype.domain
/**
 * Indicates whether the cookie is only to be sent over HTTPS (false by default
      for HTTP, true by default for HTTPS).
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.secure
/**
 * Indicates whether the cookie is only to be sent over HTTP(S), and not made
      available to client JavaScript. Default `true`.
 * @type {number|undefined}
 */
_goa.CookieAttributes.prototype.httpOnly
/**
 * Indicates whether the cookie is a "same site" cookie. This can be set to
      `'strict'`, `'lax'`, or `true` (which maps to `'strict'`).
 * @type {(boolean|string)|undefined}
 */
_goa.CookieAttributes.prototype.sameSite
/**
 * Indicating whether the cookie is to be signed. If this is true, another cookie
      of the same name with the .sig suffix appended will also be sent, with a
      27-byte url-safe base64 SHA1 value representing the hash of
      cookie-name=cookie-value against the first Keygrip key. This signature
      key is used to detect tampering the next time a cookie is received.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.signed
/**
 * Indicates whether to overwrite previously set cookies of the same name. If
      this is true, all cookies set during the same request with the same name
      (regardless of path or domain) are filtered out of the Set-Cookie header
      when setting this cookie.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.overwrite
