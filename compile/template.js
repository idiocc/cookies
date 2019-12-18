const { _Cookies, connect, express, _Keygrip } = require('./cookies')

/**
 * The interface for Cookies: signed and unsigned cookies based on Keygrip.
 * @type {new (req: !http.IncomingMessage, res: !http.ServerResponse, opts: !_goa.CookiesOptions) => Cookies}
 */
const $Cookies = _Cookies

/**
 * Signing and verifying data (such as cookies or URLs) through a rotating credential system.
 * @type {new (keys: !Array<string>, algorithm?: string, encoding?: string) => Keygrip}
 */
const $Keygrip = _Keygrip

module.exports = $Cookies
module.exports.Keygrip = $Keygrip
module.exports.connect = connect
module.exports.express = express

/* typal types/index.xml namespace */

/* typal types/keygrip.xml namespace */

/* typal types/attributes.xml namespace */

/* typal types/options.xml namespace */

/* typal types/set.xml namespace */
