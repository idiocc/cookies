export {}
/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_goa.Cookies} Cookies `@interface` Signed and unsigned cookies based on Keygrip.
 */
/**
 * @typedef {Object} _goa.Cookies `@interface` Signed and unsigned cookies based on Keygrip.
 * @prop {!_goa.Keygrip} keys The keys object constructed from passed keys.
 * @prop {boolean} [secure] Explicitly specifies if the connection is secure.
 * @prop {function(string, { signed: boolean }): (string|undefined)} get This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned.
      If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:
      - If the signature cookie hash matches the first key, the original cookie value is returned.
      - If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
      - If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.
 * @prop {function(string, String=, _goa.CookieAttributes=)} set This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.
 */
/**
 * @typedef {_goa.CookiesOptions} CookiesOptions Options for the constructor.
 */
/**
 * @typedef {Object} _goa.CookiesOptions Options for the constructor.
 * @prop {!(Array<string>|_goa.Keygrip)} keys The array of keys, or the `Keygrip` object.
 * @prop {boolean} [secure] Explicitly specifies if the connection is secure, rather than this module examining request.
 */
/**
 * @typedef {_goa.CookieAttributes} CookieAttributes Used to generate the outbound cookie header.
 */
/**
 * @typedef {Object} _goa.CookieAttributes Used to generate the outbound cookie header.
 * @prop {number} [maxAge] Represents the milliseconds from Date.now() for expiry.
 * @prop {!Date} [expires] Indicates the cookie's expiration date (expires at the end of session by default).
 * @prop {string} [path="/"] Indicates the path of the cookie. Default `/`.
 * @prop {string} [domain] Indicates the domain of the cookie.
 * @prop {boolean} [secure] Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
 * @prop {number} [httpOnly=true] Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
 * @prop {boolean|string} [sameSite=false] Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`). Default `false`.
 * @prop {boolean} [signed=false] Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. Default `false`.
 * @prop {boolean} [overwrite=false] Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. Default `false`.
 */
