/* typal types/keygrip.xml externs */
/** @const */
var _goa = {}
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
