/**
 * @fileoverview
 * @externs
 */
/* typal types/attributes.xml externs */
/** @const */
var _goa = {}
/**
 * Used to generate the outbound cookie header.
 * @record
 */
_goa.CookieAttributes
/**
 * Represents the milliseconds from `Date.now()` for expiry.
 * @type {number|undefined}
 */
_goa.CookieAttributes.prototype.maxAge
/**
 * Indicates the cookie's expiration date (expires at the end of session by default).
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
 * Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.secure
/**
 * Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.httpOnly
/**
 * Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`). Default `false`.
 * @type {(boolean|string)|undefined}
 */
_goa.CookieAttributes.prototype.sameSite
/**
 * Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. Default `false`.
 * @type {boolean|undefined}
 */
_goa.CookieAttributes.prototype.overwrite
