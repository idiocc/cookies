/**
 * @fileoverview
 * @externs
 */
/* typal types/keygrip.xml externs */
/** @const */
var _goa = {}
/**
 * Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * Creates a new Keygrip instance. Default algorithm is `sha1` and default encoding is `base64`.
 * @param {!Array<string>} keys The keys to use for signing.
 * @param {string=} [algorithm] The algorithm. Default `sha1`.
 * @param {string=} [encoding] The encoding. Default `base64`.
 * @interface
 */
_goa.Keygrip = function(keys, algorithm, encoding) {}
/**
 * This creates a SHA1 HMAC based on the _first_ key in the keylist, and outputs it as a 27-byte url-safe base64 digest (base64 without padding, replacing `+` with `-` and `/` with `_`).
 * @param {*} data The value to sign.
 * @return {string}
 */
_goa.Keygrip.prototype.sign = function(data) {}
/**
 * This loops through all of the keys currently in the keylist until the digest of the current key matches the given digest, at which point the current index is returned. If no key is matched, -1 is returned. The idea is that if the index returned is greater than `0`, the data should be re-signed to prevent premature credential invalidation, and enable better performance for subsequent challenges.
 * @param {*} data The value to verify.
 * @param {string} digest The digest to verify against.
 * @return {number}
 */
_goa.Keygrip.prototype.index = function(data, digest) {}
/**
 * This uses `index` to return true if the digest matches any existing keys, and false otherwise.
 * @param {*} data The value to verify.
 * @param {string} digest The digest to verify against.
 * @return {boolean}
 */
_goa.Keygrip.prototype.verify = function(data, digest) {}
