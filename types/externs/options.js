/**
 * @fileoverview
 * @externs
 */
/* typal types/options.xml externs */
/** @const */
var _goa = {}
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
 * How the cookie will be set.
 * @typedef {{ signed: (boolean|undefined) }}
 */
_goa.CookieSetOptions
