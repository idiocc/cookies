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
 * The keys object constructed from passed keys (private, will be installed from options).
 * @type {!_goa.Keygrip}
 */
_goa.Cookies.prototype.keys
/**
 * Explicitly specifies if the connection is secure (private, will be installed from options).
 * @type {boolean|undefined}
 */
_goa.Cookies.prototype.secure
/**
 * This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned.
      If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:
      - If the signature cookie hash matches the first key, the original cookie value is returned.
      - If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
      - If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.
 * @type {function(string, { signed: boolean }): (string|undefined)}
 */
_goa.Cookies.prototype.get
/**
 * This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.
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
 * Explicitly specifies if the connection is secure, rather than this module examining request.
 * @type {boolean|undefined}
 */
_goa.CookiesOptions.prototype.secure
/**
 * Used to generate the outbound cookie header.
 * @typedef {{ maxAge: (number|undefined), expires: ((!Date)|undefined), path: (string|undefined), domain: (string|undefined), secure: (boolean|undefined), httpOnly: (number|undefined), sameSite: ((boolean|string)|undefined), signed: (boolean|undefined), overwrite: (boolean|undefined) }}
 */
_goa.CookieAttributes

/* typal types/keygrip.xml externs */
/**
 * Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * @interface
 */
_goa.Keygrip
/**
 * This creates a SHA1 HMAC based on the _first_ key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).
 * @type {function(?): string}
 */
_goa.Keygrip.prototype.sign
/**
 * This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, -1 is returned.
      The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges.
 * @type {function(?, string): number}
 */
_goa.Keygrip.prototype.index
/**
 * This uses `index` to return true if the digest matches any existing keys, and false otherwise.
 * @type {function(?, string): boolean}
 */
_goa.Keygrip.prototype.verify
