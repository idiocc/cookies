const _Cookies = require('./cookies')

/**
 * @type {new (req: !http.IncomingMessage, res: !http.ServerResponse, opts: !_goa.CookiesOptions) => Cookies}
 */
const $Cookies = _Cookies

module.exports = $Cookies

/* typal types/index.xml namespace */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {_goa.Cookies} Cookies `＠interface` The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * @typedef {Object} _goa.Cookies `＠interface` The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * @prop {!_goa.Keygrip} [keys] The keys object constructed from passed keys (private, will be installed from options).
 * @prop {boolean} [secure] Explicitly specifies if the connection is secure (private, will be installed from options).
 * @prop {(name: string, opts: { signed: boolean }) => (string|undefined)} get This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned. If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:
 * - If the signature cookie hash matches the first key, the original cookie value is returned.
 * - If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
 * - If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.
 * @prop {(name: string, value?: ?string, attributes?: !_goa.CookieSetOptions) => void} set This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.
 */

/* typal types/keygrip.xml namespace */
/**
 * @typedef {_goa.Keygrip} Keygrip `＠interface` Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * @typedef {Object} _goa.Keygrip `＠interface` Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * @prop {(data: *) => string} sign This creates a SHA1 HMAC based on the _first_ key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).
 * @prop {(data: *, digest: string) => number} index This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, -1 is returned. The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges.
 * @prop {(data: *, digest: string) => boolean} verify This uses `index` to return true if the digest matches any existing keys, and false otherwise.
 */

/* typal types/attributes.xml namespace */
/**
 * @typedef {_goa.CookieAttributes} CookieAttributes `＠record` Used to generate the outbound cookie header.
 * @typedef {Object} _goa.CookieAttributes `＠record` Used to generate the outbound cookie header.
 * @prop {number} [maxAge] Represents the milliseconds from `Date.now()` for expiry.
 * @prop {!Date} [expires] Indicates the cookie's expiration date (expires at the end of session by default).
 * @prop {string} [path="/"] Indicates the path of the cookie. Default `/`.
 * @prop {string} [domain] Indicates the domain of the cookie.
 * @prop {boolean} [secure] Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
 * @prop {boolean} [httpOnly=true] Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
 * @prop {boolean|string} [sameSite=false] Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`). Default `false`.
 * @prop {boolean} [overwrite=false] Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. Default `false`.
 */

/* typal types/options.xml namespace */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {import('http').ServerResponse} http.ServerResponse
 * @typedef {_goa.CookiesOptions} CookiesOptions `＠record` Options for the constructor.
 * @typedef {Object} _goa.CookiesOptions `＠record` Options for the constructor.
 * @prop {!(Array<string>|_goa.Keygrip)} [keys] The array of keys, or the `Keygrip` object.
 * @prop {boolean} [secure] Explicitly specifies if the connection is secure, rather than this module examining request.
 */

/* typal types/set.xml namespace */
/**
 * @typedef {_goa.CookieSetOptions} CookieSetOptions How the cookie will be set.
 * @typedef {_goa.CookieAttributes & _goa.$CookieSetOptions} _goa.CookieSetOptions How the cookie will be set.
 * @typedef {Object} _goa.$CookieSetOptions How the cookie will be set.
 * @prop {boolean} [signed=false] Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. Default `false`.
 */
