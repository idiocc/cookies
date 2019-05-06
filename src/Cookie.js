/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

/**
 * RegExp to match Same-Site cookie attribute value.
 */
const sameSiteRegExp = /^(?:lax|strict)$/i

/**
 * @implements {_goa.CookieAttributes}
 */
export default class Cookie {
  /**
   * @param {string} name
   * @param {?string} [value]
   * @param {!_goa.CookieAttributes} [attrs]
   */
  constructor(name, value, attrs) {
    this.path = '/'
    this.expires = undefined
    this.domain = undefined
    this.maxAge = undefined
    this.httpOnly = true
    this.sameSite = false
    this.secure = false
    this.overwrite = false

    if (!fieldContentRegExp.test(name)) {
      throw new TypeError('argument name is invalid')
    }

    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError('argument value is invalid')
    }

    value || (this.expires = new Date(0))

    this.name = name
    this.value = value || ''

    for (let n in attrs) {
      /** @suppress {checkTypes} */
      this[n] = attrs[n]
    }

    if (this.path && !fieldContentRegExp.test(this.path)) {
      throw new TypeError('option path is invalid')
    }

    if (this.domain && !fieldContentRegExp.test(this.domain)) {
      throw new TypeError('option domain is invalid')
    }

    if (this.sameSite && this.sameSite !== true && !sameSiteRegExp.test(this.sameSite)) {
      throw new TypeError('option sameSite is invalid')
    }
  }
  toHeader() {
    var header = this.toString()

    if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge)

    if (this.path) header += '; path=' + this.path
    if (this.expires) header += '; expires=' + this.expires.toUTCString()
    if (this.domain) header += '; domain=' + this.domain
    if (this.sameSite) {
      header += '; samesite='
      if (this.sameSite === true) header += 'strict'
      else {
        /**
         * @suppress {checkTypes}
         * @type {string}
         */
        const sameSite = this.sameSite.toLowerCase()
        header += sameSite
      }
    }
    if (this.secure) header += '; secure'
    if (this.httpOnly) header += '; httponly'

    return header
  }
  toString() {
    return this.name + '=' + this.value
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').CookieAttributes} _goa.CookieAttributes
 */