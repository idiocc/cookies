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
   * Creates a new cookies object to handle cookies.
   * @param {!http.IncomingMessage} request
   * @param {!http.ServerResponse} response
   * @param {!_goa.CookiesOptions} [options] Options for the constructor.
   * @param {!(Array<string>|_goa.Keygrip)} [options.keys] The array of keys, or the `Keygrip` object.
   * @param {boolean} [options.secure] Explicitly specifies if the connection is secure, rather than this module examining request.
   */
  constructor(request, response, options) {
    this.secure = undefined
    this.request = request
    this.response = response
    if (options) {
      /** @type {!_goa.Keygrip|undefined} */
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
   * @param {!_goa.CookieSetOptions} [opts] Used to generate the outbound cookie header.
   */
  set(name, value, opts = {}) {
    const { response: res, request: req } = this
    let headers = /** @type {!Array<string>} */ (res.getHeader('Set-Cookie')) || []
    if (typeof headers == 'string') headers = [headers]

    /** @suppress {checkTypes} */
    const proto = req['protocol']
    /** @suppress {checkTypes} */
    const encrypted = req.connection['encrypted']
    let secure = this.secure !== undefined ? !!this.secure : proto == 'https' || encrypted

    const { signed = !!this.keys, ...rest } = opts
    const cookie = new Cookie(name, value, rest)

    if (!secure && opts.secure) {
      throw new Error('Cannot send secure cookie over unencrypted connection')
    }

    cookie.secure = secure
    if (!('secure' in opts)) cookie.secure = secure

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
 * @typedef {import('..').IncomingMessage} http.IncomingMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').ServerResponse} http.ServerResponse
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').CookieAttributes} _goa.CookieAttributes
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').Keygrip} _goa.Keygrip
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').CookiesOptions} _goa.CookiesOptions
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').CookieSetOptions} _goa.CookieSetOptions
 */