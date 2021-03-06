/**
 * @fileoverview
 * @externs
 */
/* typal types/index.xml externs */
/** @const */
var _goa = {}
/**
 * The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * Creates a new cookies object to handle cookies.
 * @param {!http.IncomingMessage} request The request object.
 * @param {!http.ServerResponse} response The response object.
 * @param {!_goa.CookiesOptions=} [options] Options for the constructor.
 * @interface
 */
_goa.Cookies = function(request, response, options) {}
/**
 * The keys object constructed from passed keys (private, will be installed from options).
 * @type {(!_goa.Keygrip)|undefined}
 */
_goa.Cookies.prototype.keys
/**
 * Explicitly specifies if the connection is secure (private, will be installed from options).
 * @type {boolean|undefined}
 */
_goa.Cookies.prototype.secure
/**
 * This extracts the cookie with the given name from the Cookie header in the request. If such a cookie exists, its value is returned. Otherwise, nothing is returned. `{ signed: true }` can optionally be passed as the second parameter options. In this case, a signature cookie (a cookie of same name ending with the .sig suffix appended) is fetched. If no such cookie exists, nothing is returned. If the signature cookie does exist, the provided Keygrip object is used to check whether the hash of cookie-name=cookie-value matches that of any registered key:
 * - If the signature cookie hash matches the first key, the original cookie value is returned.
 * - If the signature cookie hash matches any other key, the original cookie value is returned AND an outbound header is set to update the signature cookie's value to the hash of the first key. This enables automatic freshening of signature cookies that have become stale due to key rotation.
 * - If the signature cookie hash does not match any key, nothing is returned, and an outbound header with an expired date is used to delete the cookie.
 * @param {string} name The name of the cookie to get.
 * @param {{ signed: boolean }=} [opts] The options.
 * @return {(string|undefined)}
 */
_goa.Cookies.prototype.get = function(name, opts) {}
/**
 * This sets the given cookie in the response and returns the current context to allow chaining. If the value is omitted, an outbound header with an expired date is used to delete the cookie.
 * @param {string} name The name of the cookie to set.
 * @param {?string=} [value] The value to set.
 * @param {!_goa.CookieSetOptions=} [attributes] The attributes and `signed` option.
 */
_goa.Cookies.prototype.set = function(name, value, attributes) {}
