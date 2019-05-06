/*!
 * cookies
 * Copyright(c) 2014 Jed Schmidt, http://jed.is/
 * Copyright(c) 2015-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

import Keygrip from './Keygrip'
import { OutgoingMessage } from 'http'
import Cookie from './Cookie'

const cache = {}

/**
 * @implements {_goa.Cookies}
 */
export default class Cookies {
  /**
   * @param {!http.IncomingMessage} request
   * @param {!http.ServerResponse} response
   * @param {!_goa.CookiesOptions} [options] Options for the constructor.
   * @param {!(Array<string>|_goa.Keygrip)} options.keys The array of keys, or the `Keygrip` object.
   * @param {boolean} [options.secure] Explicitly specifies if the connection is secure, rather than this module examining request.
   */
  constructor(request, response, options) {
    this.secure = undefined
    this.request = request
    this.response = response
    if (options) {
      /** @type {!_goa.Keygrip} */
      this.keys = Array.isArray(options.keys) ? new Keygrip(options.keys) : options.keys
      this.secure = options.secure
    }
  }
  /**
   * @param {string} name
   * @param {{ signed: boolean }} [opts]
   */
  get(name, opts) {
    var sigName = name + '.sig'
      , header, match, index
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    /** @suppress {checkTypes} */
    header = this.request.headers['cookie']
    if (!header) return

    match = header.match(getPattern(name))
    if (!match) return

    const value = match[1]
    if (!opts || !signed) return value

    const remote = this.get(sigName)
    if (!remote) return

    const data = name + '=' + value
    if (!this.keys) throw new Error('.keys required for signed cookies')
    index = this.keys.index(data, remote)

    if (index < 0) {
      this.set(sigName, null, { path: '/', signed: false })
    } else {
      index && this.set(sigName, this.keys.sign(data), { signed: false })
      return value
    }
  }
  /**
   * @param {string} name The name of the cookie to set.
   * @param {?string} [value] The value of the cookie to set.
   * @param {!_goa.CookieAttributes} [opts] Used to generate the outbound cookie header.
   * @param {number} [opts.maxAge] Represents the milliseconds from Date.now() for expiry.
   * @param {!Date} [opts.expires] Indicates the cookie's expiration date (expires at the end of session by default).
   * @param {string} [opts.path="/"] Indicates the path of the cookie. Default `/`.
   * @param {string} [opts.domain] Indicates the domain of the cookie.
   * @param {boolean} [opts.secure] Indicates whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
   * @param {number} [opts.httpOnly=true] Indicates whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript. Default `true`.
   * @param {boolean|string} [opts.sameSite=false] Indicates whether the cookie is a "same site" cookie. This can be set to `'strict'`, `'lax'`, or `true` (which maps to `'strict'`). Default `false`.
   * @param {boolean} [opts.signed=false] Indicating whether the cookie is to be signed. If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key. This signature key is used to detect tampering the next time a cookie is received. Default `false`.
   * @param {boolean} [opts.overwrite=false] Indicates whether to overwrite previously set cookies of the same name. If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie. Default `false`.
   */
  set(name, value, opts) {
    const { response: res, request: req } = this
    let headers = /** @type {!Array<string>} */ (res.getHeader('Set-Cookie')) || []
    if (typeof headers == 'string') headers = [headers]

    /** @suppress {checkTypes} */
    const proto = req['protocol']
    /** @suppress {checkTypes} */
    const encrypted = req.connection['encrypted']
    let secure = this.secure !== undefined ? !!this.secure : proto == 'https' || encrypted

    const cookie = new Cookie(name, value, opts)
    const signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    if (!secure && opts && opts.secure) {
      throw new Error('Cannot send secure cookie over unencrypted connection')
    }

    cookie.secure = secure
    if (opts && 'secure' in opts) cookie.secure = opts.secure

    pushCookie(headers, cookie)

    if (opts && signed) {
      if (!this.keys) throw new Error('.keys required for signed cookies')
      cookie.value = this.keys.sign(cookie.toString())
      cookie.name += '.sig'
      pushCookie(headers, cookie)
    }

    /** @suppress {checkTypes} */
    const set = res['set']
    const setHeader = set ? OutgoingMessage.prototype.setHeader : res.setHeader
    setHeader.call(res, 'Set-Cookie', headers)
    return this
  }
}

function getPattern(name) {
  if (cache[name]) return cache[name]

  return cache[name] = new RegExp(
    '(?:^|;) *' +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') +
    '=([^;]*)'
  )
}

/**
 * @param {!Array<string>} headers
 * @param {!Cookie} cookie
 */
function pushCookie(headers, cookie) {
  if (cookie.overwrite) {
    for (var i = headers.length - 1; i >= 0; i--) {
      if (headers[i].indexOf(cookie.name + '=') === 0) {
        headers.splice(i, 1)
      }
    }
  }

  headers.push(cookie.toHeader())
}

export const connect = (keys) => {
  return (req, res, next) => {
    req['cookies'] = res['cookies'] = new Cookies(req, res, { keys })
    next()
  }
}
export const express = connect


/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').CookieAttributes} _goa.CookieAttributes
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').Keygrip} _goa.Keygrip
 */